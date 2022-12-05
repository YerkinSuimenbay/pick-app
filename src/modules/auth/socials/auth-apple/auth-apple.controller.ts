import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'

import { AuthAppleService } from './auth-apple.service'
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto'

import { AuthService } from '../../services'
import { SocialProvider } from '../enums'

@Controller('auth/apple')
export class AuthAppleController {
  constructor(
    public authService: AuthService,
    public authAppleService: AuthAppleService,
  ) {}

  @Get()
  test() {
    return { msg: 'auth/apple test' }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthAppleLoginDto) {
    console.log({ service: SocialProvider.apple, loginDto })
    const socialData = await this.authAppleService.getProfileByToken(loginDto)
    console.log({ socialData })
    // return this.authService.signInWithThirdParty(
    //   SocialProvider.apple,
    //   socialData,
    // )
    return 'ok'
  }
}
