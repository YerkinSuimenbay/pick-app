import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  BadRequestException,
} from '@nestjs/common'

import { AuthGoogleService } from './auth-google.service'
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto'

import { AuthService } from '../../services'
import { SocialProvider } from '../enums'

// @Controller({
//   path: 'auth/google',
//   version: '1',
// })
@Controller('auth/google')
export class AuthGoogleController {
  constructor(
    public authService: AuthService,
    public authGoogleService: AuthGoogleService,
  ) {}

  @Get()
  test() {
    return { msg: 'auth/google test' }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthGoogleLoginDto) {
    console.log({ service: SocialProvider.google, loginDto })
    try {
      const socialData = await this.authGoogleService.getProfileByToken(
        loginDto,
      )
      console.log({ socialData })
      return this.authService.signInWithThirdParty(
        SocialProvider.google,
        socialData,
      )
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('idToken')) {
          return new BadRequestException('Invalid idToken')
        }
      }
      throw error
    }
  }
}
