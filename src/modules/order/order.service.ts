import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SendToDeliver } from './entities'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(SendToDeliver)
    private readonly sendToDeliverRepository: Repository<SendToDeliver>,
  ) {}

  create(sendId: number, deliverId: number) {
    const sendToDeliver = this.sendToDeliverRepository.create({
      sendId,
      deliverId,
    })

    return this.sendToDeliverRepository.save(sendToDeliver)
  }
}
