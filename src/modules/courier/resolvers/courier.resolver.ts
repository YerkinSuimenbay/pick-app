import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CouriersFilterDto } from './../dto/couriers-filter.dto'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { CourierInputDto } from '../dto/courier-input.dto'
import { CourierService } from '../services'

@Resolver()
export class CourierResolver {
  constructor(private readonly courierService: CourierService) {}

  @Query()
  @AuthUser()
  async couriers(@Args('filter') filter: CouriersFilterDto) {
    // TODO: exclude his own courier cases
    const [list, total] = await this.courierService.find({ filter })

    return { list, total }
  }

  @Mutation()
  @AuthUser()
  createCourier(
    @CurrentUser() user: User,
    @Args('input') input: CourierInputDto,
  ) {
    return this.courierService.create(input, user)
  }

  @Mutation()
  @AuthUser()
  cancelCourier(@Args('id') id: number, @CurrentUser() user: User) {
    return this.courierService.cancel(id, user)
  }
}
