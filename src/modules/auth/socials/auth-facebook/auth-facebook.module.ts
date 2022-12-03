import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthFacebookService } from './auth-facebook.service'
import { AuthFacebookController } from './auth-facebook.controller'

import { AuthModule } from '../../auth.module'

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthFacebookService],
  exports: [AuthFacebookService],
  controllers: [AuthFacebookController],
})
export class AuthFacebookModule {}
