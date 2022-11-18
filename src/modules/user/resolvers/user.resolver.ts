import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from './../entities/user.entity'

import { AuthUser, CurrentUser } from '../../auth/decorators'
import { UserService } from '../services'
import { UpdateAccountInputDto } from '../dto'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  @AuthUser()
  me(@CurrentUser() user: User) {
    return user
  }

  @Mutation()
  @AuthUser()
  updateAccount(
    @CurrentUser() user: User,
    @Args('input') input: UpdateAccountInputDto,
  ) {
    return this.userService.updateAccount(user, input)
  }
}
