import { BadRequestException, Injectable } from '@nestjs/common'
import { FindOptionsWhere, In, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { FileService } from './../../file/file.service'

import { PackagesFilterDto } from '../dto/packages-filter.dto'
import { PackageStatus } from '../enums/package-status.enum'
import { PackageInputDto } from '../dto/package-input.dto'
import { User } from '../../user/entities'
import { Package } from '../entities'
import { LocationsService } from '../../locations/locations.service'

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly fileService: FileService,
    private readonly locationsService: LocationsService,
  ) {}

  find({ filter }: { filter?: PackagesFilterDto }) {
    const { fromId, toId, startDate, endDate, maximumWeight } = filter || {}

    const qb = this.packageRepository
      .createQueryBuilder('package')
      .innerJoinAndSelect('package.from', 'fromCity')
      .innerJoinAndSelect('fromCity.country', 'fromCityCountry')
      .innerJoinAndSelect('package.to', 'toCity')
      .innerJoinAndSelect('toCity.country', 'toCityCountry')
      .innerJoinAndSelect('package.user', 'user')
      .leftJoinAndSelect('user.idImages', 'idImages') // TODO: innerJoin
      .leftJoinAndSelect('package.images', 'image')

    if (fromId) {
      qb.andWhere('fromCity.id = :fromId', { fromId })
    }
    if (toId) {
      qb.andWhere('toCity.id = :toId', { toId })
    }
    if (endDate) {
      qb.andWhere('package.startDate <= :endDate', { endDate })
    }
    if (startDate) {
      qb.andWhere('package.endDate >= :startDate', { startDate })
    }
    if (maximumWeight) {
      qb.andWhere('package.weight <= :maximumWeight', { maximumWeight })
    }

    return qb.getManyAndCount()
  }

  findByStatus({
    userId,
    status,
  }: {
    userId?: number
    status: PackageStatus | 'active'
  }) {
    const where: FindOptionsWhere<Package> | FindOptionsWhere<Package>[] = {}
    if (userId) {
      where.userId = userId
    }

    switch (status) {
      case 'active':
        where.status = Not(
          In([
            PackageStatus.new,
            PackageStatus.delivered,
            PackageStatus.canceled,
            PackageStatus.archived,
          ]),
        )
        break
      default:
        where.status = status
    }

    return this.packageRepository.findAndCount({
      where,
      relations: [
        'images',
        'user',
        'user.idImages',
        'order',
        'order.courier',
        'order.courier.user',
        'order.courier.user.idImages',
        'from',
        'from.country',
        'to',
        'to.country',
      ],
    })
  }

  async findByIdOrFail(id: number) {
    const pack = await this.packageRepository.findOne({
      where: { id },
      relations: ['user', 'images'],
    })

    if (!pack) {
      throw new BadRequestException(
        `Package order with id ${id} does not exist`,
      )
    }

    return pack
  }

  async findByIdAndUserOrFail(user: User, id: number) {
    const pack = await this.packageRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      relations: ['user'],
    })

    if (!pack) {
      throw new BadRequestException(`Package with id ${id} not found`)
    }

    return pack
  }

  isActive(pack: Package) {
    if (pack.status !== PackageStatus.new) {
      throw new BadRequestException('Invalid package')
    }
  }

  async create(input: PackageInputDto, user: User) {
    const { imageIds, fromId, toId, ...packageInput } = input

    const images = await this.fileService.findByIds(imageIds)
    const fromCity = await this.locationsService.findCityByIdOrFail(fromId)
    const toCity = await this.locationsService.findCityByIdOrFail(toId)

    const pack = this.packageRepository.create(packageInput)
    pack.user = user
    pack.images = images
    pack.from = fromCity
    pack.to = toCity

    return this.packageRepository.save(pack)
  }

  async cancel(id: number, user: User) {
    const pack = await this.findByIdOrFail(id)

    if (pack.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (pack.status !== PackageStatus.new) {
      throw new BadRequestException('Package order cannot be canceled')
    }

    pack.status = PackageStatus.canceled

    await this.packageRepository.save(pack)

    return true
  }

  changeStatus(pack: Package, status: PackageStatus) {
    pack.status = status
    return this.packageRepository.save(pack)
  }
}
