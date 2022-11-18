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
  async packages(@Args('filter') filter: PackagesFilterDto) {
    // TODO: exclude his own packages
    const [list, total] = await this.packageService.find({ filter })

    return { list, total }
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
