import { BadRequestException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CourierService } from '../../courier/services/courier.service'
import { OrderService } from '../services/order.service'
import { OfferedBy, OfferStatus } from '../enums'
import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { PackageService } from '../../package/services'
import { OfferService } from '../services'
import { PackageStatus } from '../../package/enums'

@Resolver()
export class OrderResolver {
  constructor(
    private readonly courierService: CourierService,
    private readonly packageService: PackageService,
    private readonly orderService: OrderService,
    private readonly offerService: OfferService,
  ) {}

  @Mutation()
  @AuthUser()
  async bookThePackage(
    @CurrentUser() user: User,
    @Args('packageId') packageId: number,
    @Args('courierId') courierId: number,
  ) {
    const courier = await this.courierService.findByIdAndUserOrFail(
      user,
      courierId,
    )
    this.courierService.isActive(courier)

    const pack = await this.packageService.findByIdOrFail(packageId)
    this.packageService.isActive(pack)

    if (courier.user.id === pack.user.id) {
      throw new BadRequestException('You cannot book your own package')
    }

    const canBeBooked = await this.offerService.isPossible(packageId, courierId)
    if (!canBeBooked) {
      throw new BadRequestException(
        `Package with id ${packageId} cannot be booked by Courier with id ${courierId}`,
      )
    }

    return this.offerService.bind(pack, courier, OfferedBy.COURIER)
  }

  @Mutation()
  @AuthUser()
  async takeMyPackage(
    @CurrentUser() user: User,
    @Args('packageId') packageId: number,
    @Args('courierId') courierId: number,
  ) {
    const pack = await this.packageService.findByIdAndUserOrFail(
      user,
      packageId,
    )
    this.packageService.isActive(pack)

    const courier = await this.courierService.findByIdOrFail(courierId)
    this.courierService.isActive(courier)

    if (courier.user.id === pack.user.id) {
      throw new BadRequestException(
        'You cannot ask yourself to take your own package',
      )
    }

    const canTake = await this.offerService.isPossible(packageId, courierId)
    if (!canTake) {
      throw new BadRequestException(
        `Courier with id ${courierId} cannot take Package with id ${packageId}`,
      )
    }

    return this.offerService.bind(pack, courier, OfferedBy.SENDER)
  }

  @Mutation()
  @AuthUser()
  async cancelBookThePackage(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be canceled')
    }

    if (!offer.offeredByCourier) {
      throw new BadRequestException('Offer can only be canceled by Sender')
    }

    await this.offerService.changeStatus(offer, OfferStatus.canceled)

    return true
  }

  @Mutation()
  @AuthUser()
  async cancelTakeMyPackage(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be canceled')
    }

    if (offer.offeredByCourier) {
      throw new BadRequestException('Offer can only be canceled by Courier')
    }

    await this.offerService.changeStatus(offer, OfferStatus.canceled)

    return true
  }

  @Mutation()
  @AuthUser()
  async acceptCourier(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be accepted')
    }

    this.courierService.isActive(offer.courier)

    let order = await this.orderService.findByPackageIdAndCourierId(
      offer.packageId,
      offer.courierId,
    )

    if (order) {
      throw new BadRequestException('Order already exists')
    }

    order = await this.orderService.create(offer.package, offer.courier)
    await this.packageService.changeStatus(offer.package, PackageStatus.pickup)
    await this.offerService.changeStatus(offer, OfferStatus.accepted)

    return order
  }

  @Mutation()
  @AuthUser()
  async declineCourier(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be declined')
    }

    await this.offerService.changeStatus(offer, OfferStatus.declined)

    return true
  }

  @Mutation()
  @AuthUser()
  async acceptPackage(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be accepted')
    }

    this.packageService.isActive(offer.package)

    const order = await this.orderService.create(offer.package, offer.courier)
    await this.packageService.changeStatus(offer.package, PackageStatus.pickup)
    await this.offerService.changeStatus(offer, OfferStatus.accepted)

    return order
  }

  @Mutation()
  @AuthUser()
  async declinePackage(
    @CurrentUser() user: User,
    @Args('offerId') offerId: number,
  ) {
    const offer = await this.offerService.findByIdOrFail(offerId)

    if (offer.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (offer.status !== OfferStatus.pending) {
      throw new BadRequestException('Cannot be declined')
    }

    await this.offerService.changeStatus(offer, OfferStatus.declined)

    return true
  }

  @Mutation()
  @AuthUser()
  async intransitOrder(
    @CurrentUser() user: User,
    @Args('orderId') orderId: number,
  ) {
    const order = await this.orderService.findByIdOrFail(orderId)

    if (order.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (order.canceledDate !== null) {
      throw new BadRequestException('Order already canceled')
    }

    if (order.deliveredDate !== null) {
      throw new BadRequestException('Order already delivered')
    }

    await this.orderService.intransit(order)
    await this.packageService.changeStatus(
      order.package,
      PackageStatus.intransit,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async deliverOrder(
    @CurrentUser() user: User,
    @Args('orderId') orderId: number,
  ) {
    const order = await this.orderService.findByIdOrFail(orderId)

    if (order.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (order.canceledDate !== null) {
      throw new BadRequestException('Order already canceled')
    }

    if (order.intransitDate === null) {
      throw new BadRequestException(
        'Order cannot be delivered as it has not been intransit',
      )
    }

    await this.orderService.deliver(order)
    await this.packageService.changeStatus(
      order.package,
      PackageStatus.delivered,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async cancelOrder(
    @CurrentUser() user: User,
    @Args('orderId') orderId: number,
  ) {
    const order = await this.orderService.findByIdOrFail(orderId)

    if (order.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (order.canceledDate !== null) {
      throw new BadRequestException('Order already canceled')
    }

    if (order.deliveredDate !== null) {
      throw new BadRequestException('Order already delivered')
    }

    if (order.intransitDate !== null) {
      throw new BadRequestException('Order cannot be canceled')
    }

    await this.orderService.cancel(order)
    await this.packageService.changeStatus(
      order.package,
      PackageStatus.canceled,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async revertOrderToPickUp(
    @CurrentUser() user: User,
    @Args('orderId') orderId: number,
  ) {
    const order = await this.orderService.findByIdOrFail(orderId)

    if (order.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (order.canceledDate !== null) {
      throw new BadRequestException('Order already canceled')
    }

    if (order.deliveredDate !== null) {
      throw new BadRequestException('Order already delivered')
    }

    if (order.intransitDate === null) {
      throw new BadRequestException('Order already in pickup status')
    }

    await this.orderService.revertToPickUp(order)
    await this.packageService.changeStatus(order.package, PackageStatus.pickup)

    return true
  }
}
