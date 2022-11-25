import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { TypeOrmConfigService } from './config/typeorm-config.service'
import { GraphQLConfigService } from './config/graphql-config.service'
import { CommonModule } from './common/common.module'
import { UserModule } from './modules/user/user.module'
import { FileModule } from './modules/file/file.module'
import { AuthModule } from './modules/auth/auth.module'
import { StorageModule } from './modules/storage/storage.module'
import { OrderModule } from './modules/order/order.module'
import { PackageModule } from './modules/package/package.module'
import { CourierModule } from './modules/courier/courier.module'
import { LocationsModule } from './modules/locations/locations.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: GraphQLConfigService,
    }),
    CommonModule,
    AuthModule,
    UserModule,
    FileModule,
    StorageModule.register(),
    PackageModule,
    CourierModule,
    OrderModule,
    LocationsModule,
  ],
})
export class AppModule {}
