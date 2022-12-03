import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  BadRequestException,
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

  // async signInWithGoogle(data) {
  //   if (!data.user) throw new BadRequestException()

  //   let user = (
  //     await this.userService.findBy({ where: [{ googleId: data.user.id }] })
  //   )[0]
  //   if (user) return this.login(user)

  //   user = (
  //     await this.userService.findBy({ where: [{ email: data.user.email }] })
  //   )[0]
  //   if (user)
  //     throw new ForbiddenException(
  //       "User already exists, but Google account was not connected to user's account",
  //     )

  //   try {
  //     const newUser = new User()
  //     newUser.firstName = data.user.firstName
  //     newUser.lastName = data.user.lastName
  //     newUser.email = data.user.email
  //     newUser.googleId = data.user.id

  //     await this.userService.store(newUser)
  //     return this.login(newUser)
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }

  // async registerByIDtoken(payload: any) {
  //   if (payload.hasOwnProperty('id_token')) {
  //     let email,
  //       firstName,
  //       lastName = ''

  //     //You can decode the id_token which returned from Apple,
  //     const decodedObj = await this.jwtService.decode(payload.id_token)
  //     const accountId = decodedObj.sub || ''
  //     console.info(`Apple Account ID: ${accountId}`)

  //     //Email address
  //     if (decodedObj.hasOwnProperty('email')) {
  //       email = decodedObj['email']
  //       console.info(`Apple Email: ${email}`)
  //     }

  //     //You can also extract the firstName and lastName from the user, but they are only shown in the first time.
  //     if (payload.hasOwnProperty('user')) {
  //       const userData = JSON.parse(payload.user)
  //       const { firstName, lastName } = userData.name || {}
  //     }

  //     //.... you logic for registration and login here
  //   }
  //   throw new UnauthorizedException('Unauthorized')
  // }

  // async validateSocialLogin(
  //   authProvider: string,
  //   socialData: SocialInterface,
  // ): Promise<{ token: string; user: User }> {
  //   let user: User
  //   const socialEmail = socialData.email?.toLowerCase()

  //   const userByEmail = await this.userService.findOne({
  //     email: socialEmail,
  //   })

  //   user = await this.userService.findOne({
  //     socialId: socialData.id,
  //     provider: authProvider,
  //   })

  //   if (user) {
  //     if (socialEmail && !userByEmail) {
  //       user.email = socialEmail
  //     }
  //     await this.userService.update(user.id, user)
  //   } else if (userByEmail) {
  //     user = userByEmail
  //   } else {
  //     user = await this.userService.create({
  //       email: socialEmail,
  //       name: socialData.firstName + socialData.lastName, // TODO: fix this
  //       socialId: socialData.id,
  //       provider: authProvider,
  //     })

  //     user = await this.userService.findOne({
  //       id: user.id,
  //     })
  //   }

  //   const jwtToken = await this.jwtService.sign({
  //     id: user.id,
  //     role: user.role,
  //   })

  //   return {
  //     token: jwtToken,
  //     user,
  //   }
  // }

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
