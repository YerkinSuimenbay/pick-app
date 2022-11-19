import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Courier } from '../../courier/entities'
import { Package } from '../../package/entities'
import { PackageToCourier } from '../entities'
import { OrderBookedBy, PackageToCourierStatus } from '../enums'

@Injectable()
export class PackageToCourierService {
  constructor(
    @InjectRepository(PackageToCourier)
    private readonly packageToCourierRepository: Repository<PackageToCourier>,
  ) {}

  async findByIdOrFail(id: number) {
    const packageToCourier = await this.packageToCourierRepository.findOne({
      where: { id },
      relations: ['package', 'package.user', 'courier', 'courier.user'],
    })

    if (!packageToCourier) {
      throw new BadRequestException('Not found')
    }

    return packageToCourier
  }

  bind(pack: Package, courier: Courier, orderBookedBy: OrderBookedBy) {
    const packageToCourier = this.packageToCourierRepository.create({
      package: pack,
      courier,
      bookedByCourier: orderBookedBy === OrderBookedBy.COURIER,
    })

    return this.packageToCourierRepository.save(packageToCourier)
  }

  changeStatus(
    packageToCourier: PackageToCourier,
    status: PackageToCourierStatus,
  ) {
    packageToCourier.status = status
    return this.packageToCourierRepository.save(packageToCourier)
  }
}
