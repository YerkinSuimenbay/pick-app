import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { User } from './../user/entities/user.entity'
import { AuthService } from './services/auth.service'
import { AuthUser, CurrentUser } from './decorators'
import { ChangePasswordInputDto, RegisterInputDto } from './dto'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  register(@Args('input') input: RegisterInputDto) {
    return this.authService.register(input)
  }

  @Mutation()
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password)
  }

  @Mutation()
  @AuthUser()
  changePassword(
    @Args('input') input: ChangePasswordInputDto,
    @CurrentUser() user: User,
  ) {
    return this.authService.changePassword(input, user)
  }
}
