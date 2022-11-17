import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { CourierInputDto } from '../dto/courier-input.dto'
import { User } from '../../user/entities'
import { Courier } from '../entities'

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
  ) {}

  findById(id: number) {
    return this.courierRepository.findOne({
      where: { id },
    })
  }

  create(input: CourierInputDto, user: User) {
    const courierOrder = this.courierRepository.create(input)
    courierOrder.user = user
    return this.courierRepository.save(courierOrder)
  }

  async cancel(id: number, user: User) {
    const courier = await this.findById(id)
    if (!courier) {
      throw new BadRequestException(
        `Courier order with id ${id} does not exist`,
      )
    }

    if (courier.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (!courier.isActive) {
      throw new BadRequestException('Order cannot be canceled')
    }

    /*
    if courier already in process
    then wait for all sendOrders to become couriered
    */

    courier.isActive = false

    await this.courierRepository.save(courier)

    return true
  }
}
