import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { FacebookAuthUser, GoogleAuthUser } from './decorators'
import { AuthService } from './services'

interface OAuthRequest extends Request {
  user: any
}

@Controller('authh')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  test() {
    return { status: 'success', data: 'Auth tested' }
  }

  // @Get('/google')
  // @GoogleAuthUser()
  // async googleAuth(@Req() req: Request) {
  //   // Guard redirects
  //   return HttpStatus.OK
  // }

  // @Get('/google/redirect')
  // @GoogleAuthUser()
  // googleAuthRedirect(@Req() req: OAuthRequest) {
  //   // return this.authService.signInWithGoogle(req)
  //   return req.user
  // }

  // @Get('/facebook')
  // @FacebookAuthUser()
  // async facebookAuth(): Promise<any> {
  //   return HttpStatus.OK
  // }

  // @Get('/facebook/redirect')
  // @FacebookAuthUser()
  // async facebookAuthRedirect(@Req() req: OAuthRequest): Promise<any> {
  //   //   return this.authService.signInWithGoogle(req)
  //   return req.user
  // }

  // @Get('/apple')
  // @FacebookAuthUser()
  // async appleAuth(): Promise<any> {
  //   return HttpStatus.OK
  // }

  // @Get('/apple/redirect')
  // @FacebookAuthUser()
  // async appleAuthRedirect(@Body() payload): Promise<any> {
  //   if (payload.id_token) {
  //     return this.authService.registerByIDtoken(payload)
  //   }
  //   throw new UnauthorizedException('Unauthorized')
  // }
}
