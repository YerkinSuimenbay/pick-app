import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthGoogleService } from './auth-google.service'
import { AuthGoogleController } from './auth-google.controller'

import { AuthModule } from '../../auth.module'

@Module({
  imports: [ConfigModule, forwardRef(() => AuthModule)],
  providers: [AuthGoogleService],
  exports: [AuthGoogleService],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
