import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { Order, PackageToCourier } from './entities'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([Order, PackageToCourier])],
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
