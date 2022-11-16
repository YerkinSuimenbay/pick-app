import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DeliverService } from './services/deliver.service'
import { DeliverResolver } from './resolvers/deliver.resolver'
import { Deliver } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Deliver])],
  providers: [DeliverResolver, DeliverService],
  exports: [],
})
export class DeliverModule {}
