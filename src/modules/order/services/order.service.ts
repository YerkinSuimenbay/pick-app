import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'

import { OfferService } from './offer.service'

import { Package } from '../../package/entities/package.entity'
import { Courier } from '../../courier/entities/courier.entity'
import { Order } from '../entities/order.entity'
import { Offer } from '../entities'
import { PackageService } from '../../package/services'
import { PackageStatus } from '../../package/enums'
import { OfferStatus } from '../enums'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly packageService: PackageService,
    private readonly offerService: OfferService,
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
        courierId: courier.id,
        deliveredDate: IsNull(),
        canceledDate: IsNull(),
      },
    })

    return count > 0
  }

  async createFromOffer(offer: Offer) {
    let order = await this.findByPackageIdAndCourierId(
      offer.packageId,
      offer.courierId,
    )
    if (order) {
      throw new BadRequestException('Order already exists')
    }

    order = await this.create(offer.package, offer.courier)
    await this.packageService.changeStatus(offer.package, PackageStatus.pickup)
    await this.offerService.changeStatus(offer, OfferStatus.accepted)
    await this.offerService.declinePendingsByPackage(offer.package)

    return order
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
