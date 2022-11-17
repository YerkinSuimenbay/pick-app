import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { PackagesFilterDto } from '../dto/packages-filter.dto'
import { PackageStatus } from '../enums/package-status.enum'
import { PackageInputDto } from '../dto/package-input.dto'
import { User } from '../../user/entities'
import { Package } from '../entities'

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly PackageRepository: Repository<Package>,
  ) {}

  findById(id: number) {
    return this.PackageRepository.findOne({
      where: { id },
    })
  }

  find({ filter }: { filter?: PackagesFilterDto }) {
    const { from, to, date, maximumWeight } = filter || {}

    const qb = this.PackageRepository.createQueryBuilder(
      'Package',
    ).innerJoinAndSelect('Package.user', 'user')

    if (from) {
      qb.andWhere('Package.from = :from', { from }) // ?: lowercase
    }
    if (to) {
      qb.andWhere('Package.to = :to', { to }) // ?: lowercase
    }
    if (date) {
      qb.andWhere('Package.PackageDate = :date', { date }) // ?: fix this
    }
    if (maximumWeight) {
      qb.andWhere('Package.packageWeight <= :maximumWeight', { maximumWeight })
    }

    return qb.getManyAndCount()
  }

  create(input: PackageInputDto, user: User) {
    const PackageOrder = this.PackageRepository.create(input)
    PackageOrder.user = user

    return this.PackageRepository.save(PackageOrder)
  }

  async cancel(id: number, user: User) {
    const Package = await this.findById(id)
    if (!Package) {
      throw new BadRequestException(
        `Package order with id ${id} does not exist`,
      )
    }

    if (Package.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (Package.status !== PackageStatus.pickup) {
      throw new BadRequestException('Order cannot be canceled')
    }

    Package.status = PackageStatus.canceled

    await this.PackageRepository.save(Package)

    return true
  }
}
