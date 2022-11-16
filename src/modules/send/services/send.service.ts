import { SendStatus } from './../enums/send-status.enum'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { SendInputDto } from '../dto/send-input.dto'
import { User } from '../../user/entities'
import { Send } from '../entities'

@Injectable()
export class SendService {
  constructor(
    @InjectRepository(Send) private readonly sendRepository: Repository<Send>,
  ) {}

  findById(id: number) {
    return this.sendRepository.findOne({
      where: { id },
    })
  }

  create(input: SendInputDto, user: User) {
    const sendOrder = this.sendRepository.create(input)
    sendOrder.user = user

    return this.sendRepository.save(sendOrder)
  }

  async cancel(id: number, user: User) {
    const send = await this.findById(id)
    if (!send) {
      throw new BadRequestException(`Send order with id ${id} does not exist`)
    }

    if (send.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (send.status !== SendStatus.pickup) {
      throw new BadRequestException('Order cannot be canceled')
    }

    send.status = SendStatus.canceled

    await this.sendRepository.save(send)

    return true
  }
}
