import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { FileEntity } from './entities'

import { IUploadResponse } from '../storage/interfaces'

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(values: IUploadResponse) {
    return this.fileRepository.save(this.fileRepository.create(values))
  }

  delete(id: number) {
    return this.fileRepository.delete({ id })
  }

  findByIds(ids: number[]) {
    return this.fileRepository.findBy({ id: In(ids) })
  }

  async findByIdOrFail(id: number) {
    const image = await this.fileRepository.findOne({
      where: { id },
    })
    if (!image) {
      throw new BadRequestException('Image not found')
    }

    return image
  }
}
