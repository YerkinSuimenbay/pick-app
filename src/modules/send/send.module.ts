import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SendService } from './services/send.service'
import { Send } from './entities/send.entity'
import { SendResolver } from './resolvers/send.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Send])],
  providers: [SendResolver, SendService],
  exports: [],
})
export class SendModule {}
