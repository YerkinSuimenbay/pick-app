import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'

import { AuthGoogleLoginDto } from './dto/auth-google-login.dto'

import { SocialInterface } from '../interfaces'

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client

  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get('google_clientId'),
      configService.get('google_clientSecret'),
    )
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    console.log({ google_clientId: this.configService.get('google_clientId') })
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [this.configService.get('google_clientId')],
    })

    const data = ticket.getPayload()

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    }
  }
}
