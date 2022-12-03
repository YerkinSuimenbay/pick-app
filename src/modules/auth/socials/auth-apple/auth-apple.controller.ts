import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { AuthAppleService } from './auth-apple.service'
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto'

import { AuthService } from '../../services'

@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    public authService: AuthService,
    public authAppleService: AuthAppleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthAppleLoginDto) {
    const socialData = await this.authAppleService.getProfileByToken(loginDto)

    // return this.authService.validateSocialLogin('apple', socialData)
  }
}
