import { Courier } from './../courier/entities/courier.entity'
import { Order } from './entities/order.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import { PackageToCourier } from './entities'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PackageToCourier)
    private readonly packageToCourierRepository: Repository<PackageToCourier>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  create(packageId: number, courierId: number) {
    const sendToDeliver = this.packageToCourierRepository.create({
      packageId,
      courierId,
    })

    return this.packageToCourierRepository.save(sendToDeliver)
  }

  async isCourierInProcess(courier: Courier) {
    const count = await this.orderRepository.count({
      where: {
        courier,
        deliveredDate: Not(null),
        canceledDate: Not(null),
      },
    })

    return count > 0
  }
}
