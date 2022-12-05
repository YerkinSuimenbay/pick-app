import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common'

import { AuthGoogleService } from './auth-google.service'
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto'

import { AuthService } from '../../services'

// @Controller({
//   path: 'auth/google',
//   version: '1',
// })
@Controller('auth')
export class AuthGoogleController {
  constructor(
    public authService: AuthService,
    public authGoogleService: AuthGoogleService,
  ) {}

  @Get()
  test() {
    return { msg: 'auth test' }
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthGoogleLoginDto) {
    console.log({ service: 'google', loginDto })
    const socialData = await this.authGoogleService.getProfileByToken(loginDto)
    console.log({ socialData })
    // return this.authService.validateSocialLogin('google', socialData)
    return 'ok'
  }
}
