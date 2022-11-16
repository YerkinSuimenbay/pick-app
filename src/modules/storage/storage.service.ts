import { Injectable, Inject } from '@nestjs/common'
import { FileUpload } from 'graphql-upload'
import * as mkdirp from 'mkdirp'

import { ReadStream, createWriteStream, unlink, statSync, writeFile } from 'fs'
import { randomUUID } from 'crypto'
import { extname, join } from 'path'

import { STORAGE_OPTIONS } from './constants'
import { IStorageOptions, IUploadOptions, IUploadResponse } from './interfaces'

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_OPTIONS) private readonly options: IStorageOptions,
  ) {
    mkdirp.sync(this.options.rootPath)
  }

  async uploadFile(
    file: FileUpload,
    options: IUploadOptions,
  ): Promise<IUploadResponse> {
    const { createReadStream, mimetype, filename } = file
    console.log({ file })
    const stream = createReadStream()

    const extension = this.getFileExtension(filename)
    const name = options.fileName || randomUUID()
    const filePath = await this.storeFile(
      stream,
      options.dir,
      `${name}.${extension}`,
    )
    const size = this.getFilesizeInBytes(filePath)
    const uri = `${options.dir}/${name}`

    return {
      name,
      path: uri,
      extension,
      mimeType: mimetype,
      size,
    }
  }

  private storeFile(
    stream: ReadStream,
    dir: string,
    filename: string,
  ): Promise<string> {
    const uploadDir = join(this.options.rootPath, dir)
    mkdirp.sync(uploadDir)

    const path = `${uploadDir}/${filename}`

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(path)

      writeStream
        .on('finish', () => resolve(path))
        .on('error', (error) => {
          unlink(path, () => {
            reject(error)
          })
        })

      stream
        .on('error', (error) => writeStream.destroy(error))
        .pipe(writeStream)
    })
  }

  store(
    content: string | Buffer,
    dir: string,
    filename: string,
  ): Promise<string> {
    const uploadDir = `${this.options.rootPath}${dir}`
    mkdirp.sync(uploadDir)

    const path = `${uploadDir}/${filename}`

    return new Promise((resolve, reject) => {
      writeFile(path, content, (error) => {
        if (error) {
          reject(error)
        }
        resolve(path)
      })
    })
  }

  getStoreDir(dirOrFileName: string) {
    return `${this.options.rootPath}${dirOrFileName}`
  }

  deleteFile(path: string) {
    const fullPath = `${this.options.rootPath}${path}`

    unlink(fullPath, () => null)
  }

  getFilesizeInBytes(filePath: string): number {
    const stat = statSync(filePath)
    const size = stat['size']

    return size
  }

  getFileExtension(fileName: string): string {
    const ext = extname(fileName).split('.')

    return ext[ext.length - 1]
  }
}
