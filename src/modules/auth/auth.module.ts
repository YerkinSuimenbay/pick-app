import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from './../user/user.module'
import { SessionEntity } from './entities/session.entity'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './services'
import { SessionService } from './services/session.service'
import { JwtRefreshStrategy, JwtStrategy } from './strategies'
import { RolesGuard } from './guards/role.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.register({}),
    forwardRef(() => UserModule),
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
