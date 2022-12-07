import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FacebookAuthModule } from 'facebook-auth-nestjs'

import { UserModule } from './../user/user.module'
import { SessionEntity } from './entities/session.entity'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './services'
import { SessionService } from './services/session.service'
import { JwtRefreshStrategy, JwtStrategy } from './strategies'
import { RolesGuard } from './guards/role.guard'
import { AuthGoogleModule } from './socials/auth-google/auth-google.module'

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
    forwardRef(() => AuthGoogleModule),
  ],
  providers: [
    AuthResolver,
    AuthService,
    SessionService,
    JwtStrategy,
    JwtRefreshStrategy,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
