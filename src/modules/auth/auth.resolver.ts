import { Args, Mutation, Resolver } from '@nestjs/graphql'
// import { OAuth2Client } from 'google-auth-library'
import { FacebookAuthService } from 'facebook-auth-nestjs'

import { User } from './../user/entities/user.entity'
import { AuthService } from './services/auth.service'
import {
  AuthUser,
  CurrentUser,
  RefreshAuthUser,
  JwtPayload,
} from './decorators'
import { ChangePasswordInputDto, RegisterInputDto } from './dto'
import { IJwtPayload } from './interfaces'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {}

  @Mutation()
  register(@Args('input') input: RegisterInputDto) {
    return this.authService.register(input)
  }

  @Mutation()
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password)
  }

  // @Mutation()
  // async loginWithGoogle(@Args('token') token: string) {
  //   const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.GOOGLE_CLIENT_ID,
  //   })
  //   // log the ticket payload in the console to see what we have
  //   console.log(ticket.getPayload())
  // }

  // @Mutation()
  // async loginWithFacebook(@Args('token') accessToken: string) {
  //   await this.facebookAuthService.getUser(accessToken, 'id', 'name')
  // }

  @Mutation()
  @AuthUser()
  changePassword(
    @Args('input') input: ChangePasswordInputDto,
    @CurrentUser() user: User,
  ) {
    return this.authService.changePassword(input, user)
  }

  @Mutation()
  @RefreshAuthUser()
  refreshTokens(
    @CurrentUser() user: User,
    @JwtPayload() jwtPayload: IJwtPayload,
  ) {
    return this.authService.refreshUserTokens(user, jwtPayload.sessionToken)
  }
}
