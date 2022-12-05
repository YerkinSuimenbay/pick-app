import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { SessionService } from './session.service'
import { ChangePasswordInputDto } from './../dto/change-password-input.dto'

import { UserService } from '../../user/services'
import { RegisterInputDto } from '../dto/register-input.dto'
import { IJwtPayload } from '../interfaces'
import { User } from '../../user/entities'
import { SessionEntity } from '../entities'
import { SocialInterface } from '../socials/interfaces'
import { SocialProvider } from '../socials/enums'

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
    input.email = input.email.toLowerCase().trim()
    input.phone = input.phone.trim()

    const isEmailInUse = await this.userService.findByEmail(input.email)
    if (!!isEmailInUse) {
      throw new BadRequestException(`Email ${input.email} not available`)
    }

    const isPhoneInUse = await this.userService.findByPhone(input.phone)
    if (!!isPhoneInUse) {
      throw new BadRequestException(`Phone ${input.phone} not available`)
    }

    const hashedPassword = await this.hashPassword(input.password)
    input.password = hashedPassword

    const user = await this.userService.create(input)

    return this.authResponse(user)
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

    return this.authResponse(user)
  }

  async signInWithThirdParty(
    socialProvider: SocialProvider,
    socialData: SocialInterface,
  ) {
    let user = await this.userService.findBySocialIdAndProvider(
      socialData.id,
      socialProvider,
    )
    if (user) return this.authResponse(user)

    user = await this.userService.findByEmail(socialData.email)
    if (user)
      throw new ForbiddenException(
        `User already exists, but ${socialProvider} account was not connected to user's account`,
      )

    user = await this.userService.createSocial(socialProvider, socialData)

    return this.authResponse(user)
  }

  async authResponse(user: User) {
    const session = await this.sessionService.upsert(user)
    const payload = this.generatePayload(user, session)
    const { token, refreshToken } = this.generateToken(payload)
    return { token, refreshToken, user }
  }

  async changePassword(input: ChangePasswordInputDto, user: User) {
    const isValid = await this.validatePassword(
      input.currentPassword,
      user.password,
    )

    if (!isValid) {
      throw new BadRequestException('Invalid password')
    }

    if (input.newPassword !== input.repeatNewPassword) {
      throw new BadRequestException(
        'newPassword and repeatedNewPassword do not match',
      )
    }

    const hashedNewPassword = await this.hashPassword(input.newPassword)
    await this.userService.changePassword(user, hashedNewPassword)

    return true
  }

  refreshUserTokens(user: User, sessionToken: string) {
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      sessionToken,
    }
    const { token, refreshToken } = this.generateToken(payload)

    return {
      user,
      token,
      refreshToken,
    }
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
