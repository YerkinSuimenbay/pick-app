import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UserModule } from './../user/user.module'
import { SessionEntity } from './entities/session.entity'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './services'
import { SessionService } from './services/session.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60d'),
          },
        }
      },
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthResolver, AuthService, SessionService],
  exports: [AuthService],
})
export class AuthModule {}
