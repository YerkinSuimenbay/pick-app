import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FacebookAuthModule } from 'facebook-auth-nestjs'

import { AuthController } from './auth.controller'
import { UserModule } from './../user/user.module'
import { SessionEntity } from './entities/session.entity'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './services'
import { SessionService } from './services/session.service'
import {
  FacebookStrategy,
  GoogleStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
} from './strategies'
import { RolesGuard } from './guards/role.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.register({}),
    forwardRef(() => UserModule),
    FacebookAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          clientId: configService.get<number>('FACEBOOK_CLIENT_ID'),
          clientSecret: configService.get<string>('FACEBOOK_CLIENT_ID'),
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    SessionService,
    JwtStrategy,
    JwtRefreshStrategy,
    RolesGuard,
    GoogleStrategy,
    FacebookStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
