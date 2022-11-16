import { Query, Resolver } from '@nestjs/graphql'

import { UserService } from '../services'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  me() {
    return this.userService.me()
  }
}
