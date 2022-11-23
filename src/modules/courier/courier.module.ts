import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'

import { UserModule } from './../user/user.module'
import { OrderModule } from './../order/order.module'
import { CourierService } from './services/courier.service'
import { CourierResolver } from './resolvers/courier.resolver'
import { Courier } from './entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([Courier]),
    forwardRef(() => OrderModule),
    UserModule,
  ],
  providers: [CourierResolver, CourierService],
  exports: [CourierService],
})
export class CourierModule {}
