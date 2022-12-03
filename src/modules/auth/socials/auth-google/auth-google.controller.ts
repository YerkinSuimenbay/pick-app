import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { AuthGoogleService } from './auth-google.service'
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto'

import { AuthService } from '../../services'

@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    public authService: AuthService,
    public authGoogleService: AuthGoogleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthGoogleLoginDto) {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto)

    // return this.authService.validateSocialLogin('google', socialData)
  }
}
