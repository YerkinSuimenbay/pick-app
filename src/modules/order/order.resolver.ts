import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { OrderService } from './order.service'

import { AuthUser, CurrentUser } from '../auth/decorators'
import { User } from '../user/entities'

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation()
  @AuthUser()
  bookTheDelivery(
    // TODO: sendUser !== deliverUser
    @Args('sendId') sendId: number,
    @Args('deliverId') deliverId: number,
    @CurrentUser() user: User,
  ) {
    return this.orderService.create(sendId, deliverId)
  }
  @Mutation()
  @AuthUser()
  takeMyOrder(
    // TODO: sendUser !== deliverUser
    @Args('sendId') sendId: number,
    @Args('deliverId') deliverId: number,
    @CurrentUser() user: User,
  ) {
    return this.orderService.create(sendId, deliverId)
  }
}
