import { BadRequestException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './../../user/services/user.service'
import { OfferService } from './../../order/services/offer.service'
import { CouriersFilterDto } from './../dto/couriers-filter.dto'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { CourierInputDto } from '../dto/courier-input.dto'
import { CourierService } from '../services'
import { OfferedBy } from '../../order/enums'

@Resolver()
export class CourierResolver {
  constructor(
    private readonly courierService: CourierService,
    private readonly offerService: OfferService,
    private readonly userService: UserService,
  ) {}

  @Query()
  @AuthUser()
  async couriers(@Args('filter') filter: CouriersFilterDto) {
    // TODO: exclude his own courier cases
    const [list, total] = await this.courierService.find({ filter })

    return { list, total }
  }

  @Query()
  @AuthUser()
  async myCouriers(@CurrentUser() user: User) {
    const [couriers, total] = await this.courierService.findByUserId({
      userId: user.id,
      isActive: true,
    })

    const list = await Promise.all(
      couriers.map(async (courier) => {
        const [offersIn, totalIn] =
          await this.offerService.findByCourierIdAndOfferfedByCourier(
            courier.id,
            OfferedBy.SENDER,
          )
        const [offersOut, totalOut] =
          await this.offerService.findByCourierIdAndOfferfedByCourier(
            courier.id,
            OfferedBy.COURIER,
          )

        return {
          courier,
          incomingOffers: { list: offersIn, total: totalIn },
          outgoingOffers: { list: offersOut, total: totalOut },
        }
      }),
    )

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

  @Mutation()
  @AuthUser()
  async addCourierToFavorites(
    @Args('courierId') courierId: number,
    @CurrentUser() user: User,
  ) {
    const courier = await this.courierService.findByIdOrFail(courierId)
    if (user.id === courier.userId) {
      throw new BadRequestException('You cannot add yourself to favorites list')
    }
    await this.userService.favorite(user, courier.user)

    return true
  }
}
