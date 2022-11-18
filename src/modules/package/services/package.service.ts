import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { FileService } from './../../file/file.service'

import { PackagesFilterDto } from '../dto/packages-filter.dto'
import { PackageStatus } from '../enums/package-status.enum'
import { PackageInputDto } from '../dto/package-input.dto'
import { User } from '../../user/entities'
import { Package } from '../entities'

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly fileService: FileService,
  ) {}

  async findByIdOrFail(id: number) {
    const pack = await this.packageRepository.findOne({
      where: { id },
    })

    if (!pack) {
      throw new BadRequestException(
        `Package order with id ${id} does not exist`,
      )
    }

    return pack
  }

  find({ filter }: { filter?: PackagesFilterDto }) {
    const { from, to, date, maximumWeight } = filter || {}

    const qb = this.packageRepository
      .createQueryBuilder('package')
      .innerJoinAndSelect('package.user', 'user')
      .leftJoinAndSelect('user.idImages', 'idImages') // TODO: innerJoin
      .leftJoinAndSelect('package.images', 'image')

    if (from) {
      qb.andWhere('package.from = :from', { from }) // ?: lowercase
    }
    if (to) {
      qb.andWhere('package.to = :to', { to }) // ?: lowercase
    }
    if (date) {
      qb.andWhere('package.sendDate >= :date', { date }) // ?: fix this
    }
    if (maximumWeight) {
      qb.andWhere('package.weight <= :maximumWeight', { maximumWeight })
    }

    return qb.getManyAndCount()
  }

  async create(input: PackageInputDto, user: User) {
    const { imageIds, ...packageInput } = input
    const pack = this.packageRepository.create(packageInput)
    const images = await this.fileService.findByIds(imageIds)

    pack.user = user
    pack.images = images

    return this.packageRepository.save(pack)
  }

  async cancel(id: number, user: User) {
    const pack = await this.findByIdOrFail(id)

    if (pack.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (
      pack.status !== PackageStatus.new &&
      pack.status !== PackageStatus.pickup
    ) {
      throw new BadRequestException('Package order cannot be canceled')
    }

    pack.status = PackageStatus.canceled

    await this.packageRepository.save(pack)

    return true
  }
}