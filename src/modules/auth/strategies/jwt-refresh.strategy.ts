import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '../../user/entities'
import { UserService } from '../../user/services'
import { NoSessionException } from '../exceptions'
import { IJwtPayload } from '../interfaces'
import { SessionService } from '../services/session.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      // passReqToCallback: true,
    })
  }

  async validate(
    payload: IJwtPayload,
  ): Promise<{ user: User; payload: IJwtPayload }> {
    const user = await this.authorizeUser(payload)
    return {
      user,
      payload,
    }
  }

  private async authorizeUser(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email)

    const hasSession = await this.sessionService.hasSession(
      user,
      payload.sessionToken,
    )
    if (!hasSession) {
      throw new NoSessionException()
    }

    return user
  }
}
