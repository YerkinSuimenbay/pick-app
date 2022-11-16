import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { Order, SendToDeliver } from './entities'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([Order, SendToDeliver])],
  providers: [OrderResolver, OrderService],
  exports: [],
})
export class OrderModule {}
