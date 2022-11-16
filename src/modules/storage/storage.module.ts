import { DynamicModule, Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { STORAGE_OPTIONS } from './constants'
import { IStorageOptions } from './interfaces'
import { StorageService } from './storage.service'

@Global()
@Module({})
export class StorageModule {
  static register(): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        {
          provide: STORAGE_OPTIONS,
          useFactory: (configService: ConfigService) => {
            const options: IStorageOptions = {
              rootPath: configService.get<string>('STORAGE_ROOT'),
            }

            return options
          },
          inject: [ConfigService],
        },
        StorageService,
      ],
      exports: [StorageService],
    }
  }
}
