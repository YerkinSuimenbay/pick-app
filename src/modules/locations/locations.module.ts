import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { City, Country } from './entities'
import { LocationsResolver } from './locations.resolver'
import { LocationsService } from './locations.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Country, City])],
  providers: [LocationsService, LocationsResolver],
  exports: [LocationsService],
})
export class LocationsModule {}
