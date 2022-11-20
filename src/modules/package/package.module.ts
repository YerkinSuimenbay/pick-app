import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PackageService } from './services/package.service'
import { Package } from './entities/package.entity'
import { PackageResolver } from './resolvers/package.resolver'
import { OrderModule } from './../order/order.module'

@Module({
  imports: [TypeOrmModule.forFeature([Package]), forwardRef(() => OrderModule)],
  providers: [PackageResolver, PackageService],
  exports: [PackageService],
})
export class PackageModule {}
