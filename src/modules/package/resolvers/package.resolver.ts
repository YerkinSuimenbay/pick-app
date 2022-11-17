import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PackagesFilterDto } from '../dto/packages-filter.dto'
import { AuthUser, CurrentUser } from '../../auth/decorators'
import { User } from '../../user/entities'
import { PackageInputDto } from '../dto'
import { PackageService } from '../services'

@Resolver()
export class PackageResolver {
  constructor(private readonly packageService: PackageService) {}

  @Query()
  @AuthUser()
  packages(@Args('filter') filter: PackagesFilterDto) {
    return this.packageService.find({ filter })
  }

  @Mutation()
  @AuthUser()
  createPackage(
    @Args('input') input: PackageInputDto,
    @CurrentUser() user: User,
  ) {
    return this.packageService.create(input, user)
  }

  @Mutation()
  @AuthUser()
  cancelPackage(@Args('id') id: number, @CurrentUser() user: User) {
    return this.packageService.cancel(id, user)
  }
}
