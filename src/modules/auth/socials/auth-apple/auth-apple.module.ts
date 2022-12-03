import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthAppleService } from './auth-apple.service'
import { AuthAppleController } from './auth-apple.controller'

import { AuthModule } from '../../auth.module'

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
})
export class AuthAppleModule {}
