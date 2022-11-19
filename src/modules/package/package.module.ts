import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PackageService } from './services/package.service'
import { Package } from './entities/package.entity'
import { PackageResolver } from './resolvers/package.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackageResolver, PackageService],
  exports: [PackageService],
})
export class PackageModule {}
