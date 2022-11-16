import { TypeOrmModule } from '@nestjs/typeorm'
import { Global, Module } from '@nestjs/common'

import { FileResolver } from './file.resolver'
import { FileEntity } from './entities'
import { FileService } from './file.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileResolver, FileService],
  exports: [FileService],
})
export class FileModule {}
