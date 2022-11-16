import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FileUpload } from 'graphql-upload'
import { ConfigService } from '@nestjs/config'

import { FileService } from './file.service'
import { FileEntity } from './entities'

import { AuthUser } from '../auth/decorators'
import { StorageService } from '../storage/storage.service'

@Resolver('File')
export class FileResolver {
  constructor(
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  @ResolveField('url')
  url(@Parent() file: FileEntity): string {
    const storageUrl = this.configService.get<string>('STORAGE_URL')
    console.log('URL: ', `${storageUrl}${file.path}.${file.extension}`)
    return `${storageUrl}${file.path}.${file.extension}`
  }

  @Mutation()
  @AuthUser()
  async singleFileUpload(@Args('file') file: FileUpload) {
    const response = await this.storageService.uploadFile(file, {
      dir: `uploads/images`,
    })

    return this.fileService.create(response)
  }
}
