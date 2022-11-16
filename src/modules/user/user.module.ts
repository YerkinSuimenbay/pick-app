import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'

import { User } from './entities'
import { UserService } from './services'
import { UserResolver } from './resolvers'

import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
