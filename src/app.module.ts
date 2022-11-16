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
import { SendModule } from './modules/send/send.module'
import { DeliverModule } from './modules/deliver/deliver.module'
import { OrderModule } from './modules/order/order.module'

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
    SendModule,
    DeliverModule,
    OrderModule,
  ],
})
export class AppModule {}
