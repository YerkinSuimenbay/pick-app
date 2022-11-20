import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import { Package } from '../../package/entities/package.entity'
import { Courier } from '../../courier/entities/courier.entity'
import { Order } from '../entities/order.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findByPackageIdAndCourierId(
    packageId: number,
    courierId: number,
  ): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        packageId,
        courierId,
      },
    })
  }

  async findByIdOrFail(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['package', 'package.user', 'courier', 'courier.user'],
    })

    if (!order) {
      throw new BadRequestException(`Order with id ${id} not found`)
    }

    return order
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

  create(pack: Package, courier: Courier) {
    const order = this.orderRepository.create({
      package: pack,
      courier,
      pickUpDate: new Date(),
    })

    return this.orderRepository.save(order)
  }

  intransit(order: Order) {
    order.intransitDate = new Date()
    return this.orderRepository.save(order)
  }

  deliver(order: Order) {
    order.deliveredDate = new Date()
    return this.orderRepository.save(order)
  }

  cancel(order: Order) {
    order.canceledDate = new Date()
    return this.orderRepository.save(order)
  }

  revertToPickUp(order: Order) {
    order.intransitDate = null
    return this.orderRepository.save(order)
  }
}
