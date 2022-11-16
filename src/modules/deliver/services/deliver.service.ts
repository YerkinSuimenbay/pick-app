import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { DeliverInputDto } from '../dto/deliver-input.dto'
import { User } from '../../user/entities'
import { Deliver } from '../entities'

@Injectable()
export class DeliverService {
  constructor(
    @InjectRepository(Deliver)
    private readonly deliverRepository: Repository<Deliver>,
  ) {}

  findById(id: number) {
    return this.deliverRepository.findOne({
      where: { id },
    })
  }

  create(input: DeliverInputDto, user: User) {
    const deliverOrder = this.deliverRepository.create(input)
    deliverOrder.user = user
    return this.deliverRepository.save(deliverOrder)
  }

  async cancel(id: number, user: User) {
    const deliver = await this.findById(id)
    if (!deliver) {
      throw new BadRequestException(
        `Deliver order with id ${id} does not exist`,
      )
    }

    if (deliver.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (!deliver.active) {
      throw new BadRequestException('Order cannot be canceled')
    }

    /*
    if deliver already in process
    then wait for all sendOrders to become delivered
    */

    deliver.active = false

    await this.deliverRepository.save(deliver)

    return true
  }
}
