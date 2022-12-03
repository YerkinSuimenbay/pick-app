import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-facebook'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    configService: ConfigService,
    // private readonly usersService: UsersService,
  ) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_REDIRECT_URL'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    // done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile

    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    }

    // done(null, user)
    return user
  }
}
