import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'

import { CourierModule } from './../courier/courier.module'
import { PackageModule } from './../package/package.module'
import { Order, PackageToCourier } from './entities'
import { OrderResolver } from './resolvers/order.resolver'
import { OrderService } from './services/order.service'
import { PackageToCourierService } from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, PackageToCourier]),
    forwardRef(() => CourierModule),
    PackageModule,
  ],
  providers: [OrderResolver, OrderService, PackageToCourierService],
  exports: [OrderService],
})
export class OrderModule {}
