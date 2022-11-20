import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'

import { CourierModule } from './../courier/courier.module'
import { PackageModule } from './../package/package.module'
import { Order, Offer } from './entities'
import { OrderResolver } from './resolvers/order.resolver'
import { OrderService } from './services/order.service'
import { OfferService } from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Offer]),
    forwardRef(() => CourierModule),
    forwardRef(() => PackageModule),
  ],
  providers: [OrderResolver, OrderService, OfferService],
  exports: [OrderService, OfferService],
})
export class OrderModule {}
