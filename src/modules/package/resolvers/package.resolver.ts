import { BadRequestException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { PackageInputDto, PackagesFilterDto } from '../dto'
import { PackageService } from '../services'
import { PackageStatus } from '../enums'
import { OfferedBy } from '../../order/enums'
import { OfferService } from '../../order/services'

@Resolver()
export class PackageResolver {
  constructor(
    private readonly packageService: PackageService,
    private readonly offerService: OfferService,
  ) {}

  @Query()
  @AuthUser()
  async packages(@Args('filter') filter: PackagesFilterDto) {
    // TODO: exclude his own packages
    const [list, total] = await this.packageService.find({ filter })

    return { list, total }
  }

  @Query()
  @AuthUser()
  async myNewPackages(@CurrentUser() user: User) {
    const [packages, total] = await this.packageService.findByStatus({
      status: PackageStatus.new,
      userId: user.id,
    })

    const list = await Promise.all(
      packages.map(async (pack) => {
        const [offersIn, totalIn] =
          await this.offerService.findByPackageIdAndOfferfedByCourier(
            pack.id,
            OfferedBy.COURIER,
          )
        const [offersOut, totalOut] =
          await this.offerService.findByPackageIdAndOfferfedByCourier(
            pack.id,
            OfferedBy.SENDER,
          )

        return {
          package: pack,
          incomingOffers: { list: offersIn, total: totalIn },
          outgoingOffers: { list: offersOut, total: totalOut },
        }
      }),
    )

    return { list, total }
  }

  @Query()
  @AuthUser()
  async myActivePackages(@CurrentUser() user: User) {
    const [packages, total] = await this.packageService.findByStatus({
      status: 'active',
      userId: user.id,
    })

    return { list: packages, total }
  }

  @Mutation()
  @AuthUser()
  createPackage(
    @Args('input') input: PackageInputDto,
    @CurrentUser() user: User,
  ) {
    if (input.fromId === input.toId) {
      throw new BadRequestException('Same city, better to use taxi')
    }

    if (input.startDate > input.endDate) {
      throw new BadRequestException(
        'Start date should be less than or equal to end date',
      )
    }

    return this.packageService.create(input, user)
  }

  @Mutation()
  @AuthUser()
  cancelPackage(@Args('id') id: number, @CurrentUser() user: User) {
    return this.packageService.cancel(id, user)
  }
}
