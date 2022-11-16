import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { SessionService } from './session.service'

import { UserService } from '../../user/services'
import { RegisterInputDto } from '../dto/register-input.dto'
import { IJwtPayload } from '../interfaces'
import { User } from '../../user/entities'
import { SessionEntity } from '../entities'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async register(input: RegisterInputDto) {
    const hashedPassword = await this.hashPassword(input.password)
    input.password = hashedPassword

    const user = await this.userService.create(input)

    const session = await this.sessionService.upsert(user)
    const payload = this.generatePayload(user, session)
    const { token, refreshToken } = this.generateToken(payload)
    return { token, refreshToken, user }
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException(`User with email ${email} does not exist`)
    }

    const isValid = await this.validatePassword(password, user.password)
    if (!isValid) {
      throw new BadRequestException('Invalid credentials')
    }

    const session = await this.sessionService.upsert(user)
    const payload = this.generatePayload(user, session)
    const { token, refreshToken } = this.generateToken(payload)

    return { token, refreshToken, user }
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 12)
  }

  private validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }

  private generatePayload(user: User, session: SessionEntity) {
    return {
      id: user.id,
      email: user.email,
      sessionToken: session.sessionToken,
    }
  }

  private generateToken(payload: IJwtPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    })

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    })

    return { refreshToken, token }
  }
}