import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ForbiddenError } from 'apollo-server-express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '../../user/entities/user.entity'
import { UserService } from '../../user/services/user.service'
import { NoSessionException } from '../exceptions'
import { IJwtPayload } from '../interfaces'
import { SessionService } from '../services/session.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(
    payload: IJwtPayload,
  ): Promise<{ user: User; payload: IJwtPayload }> {
    const user = await this.authorizeUser(payload)
    return { user, payload }
  }

  private async authorizeUser(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.id)

    if (!user.idType || !user.idNumber || !user.idImages) {
      throw new ForbiddenError('Please fill in your ID data')
    }

    if (!user.phone) {
      throw new ForbiddenError('Please fill in your phone')
    }

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
