import { BadRequestException } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CourierService } from '../../courier/services/courier.service'
import { OrderService } from '../services/order.service'
import { OrderBookedBy, PackageToCourierStatus } from '../enums'
import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { PackageService } from '../../package/services'
import { PackageToCourierService } from '../services'
import { PackageStatus } from '../../package/enums'

@Resolver()
export class OrderResolver {
  constructor(
    private readonly courierService: CourierService,
    private readonly packageService: PackageService,
    private readonly orderService: OrderService,
    private readonly packageToCourierService: PackageToCourierService,
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

    return this.packageToCourierService.bind(
      pack,
      courier,
      OrderBookedBy.COURIER,
    )
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

    return this.packageToCourierService.bind(
      pack,
      courier,
      OrderBookedBy.SENDER,
    )
  }

  @Mutation()
  @AuthUser()
  async cancelBookThePackage(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be canceled')
    }

    await this.packageToCourierService.changeStatus(
      packageToCourier,
      PackageToCourierStatus.canceled,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async cancelTakeMyPackage(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be canceled')
    }

    await this.packageToCourierService.changeStatus(
      packageToCourier,
      PackageToCourierStatus.canceled,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async acceptCourier(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be accepted')
    }

    const order = await this.orderService.create(
      packageToCourier.package,
      packageToCourier.courier,
    )
    await this.packageService.changeStatus(
      packageToCourier.package,
      PackageStatus.pickup,
    )

    return order
  }

  @Mutation()
  @AuthUser()
  async declineCourier(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.package.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be declined')
    }

    await this.packageToCourierService.changeStatus(
      packageToCourier,
      PackageToCourierStatus.declined,
    )

    return true
  }

  @Mutation()
  @AuthUser()
  async acceptPackage(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be accepted')
    }

    const order = await this.orderService.create(
      packageToCourier.package,
      packageToCourier.courier,
    )
    await this.packageService.changeStatus(
      packageToCourier.package,
      PackageStatus.pickup,
    )

    return order
  }

  @Mutation()
  @AuthUser()
  async declinePackage(
    @CurrentUser() user: User,
    @Args('packageToCourierId') packageToCourierId: number,
  ) {
    const packageToCourier = await this.packageToCourierService.findByIdOrFail(
      packageToCourierId,
    )

    if (packageToCourier.courier.user.id !== user.id) {
      throw new BadRequestException('Not allowed')
    }

    if (packageToCourier.status !== PackageToCourierStatus.pending) {
      throw new BadRequestException('Cannot be declined')
    }

    await this.packageToCourierService.changeStatus(
      packageToCourier,
      PackageToCourierStatus.declined,
    )

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
    // ?: SHOULD PACKAGE.status = CANCEL

    return true
  }

  @Mutation()
  @AuthUser()
  async revertOrder(
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
