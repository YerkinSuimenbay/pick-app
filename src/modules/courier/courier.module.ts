import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { OrderModule } from './../order/order.module'
import { CourierService } from './services/courier.service'
import { CourierResolver } from './resolvers/courier.resolver'
import { Courier } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Courier]), OrderModule],
  providers: [CourierResolver, CourierService],
  exports: [],
})
export class CourierModule {}
