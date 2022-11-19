import { BadRequestException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { OrderService } from '../../order/services/order.service'

import { CourierInputDto } from '../dto/courier-input.dto'
import { User } from '../../user/entities'
import { Courier } from '../entities'
import { CouriersFilterDto } from '../dto'

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
    private readonly orderService: OrderService,
  ) {}

  find({ filter }: { filter?: CouriersFilterDto }) {
    const { from, to, date } = filter || {}

    const qb = this.courierRepository
      .createQueryBuilder('courier')
      .innerJoinAndSelect('courier.user', 'user')
      .leftJoinAndSelect('user.idImages', 'idImages') // TODO: innerJoin

    if (from) {
      qb.andWhere('courier.from = :from', { from }) // ?: lowercase
    }
    if (to) {
      qb.andWhere('courier.to = :to', { to }) // ?: lowercase
    }
    if (date) {
      qb.andWhere('courier.date = :date', { date }) // ?: fix this
    }

    return qb.getManyAndCount()
  }

  async findByIdAndUserOrFail(user: User, id: number) {
    const courier = await this.courierRepository.findOne({
      where: {
        id,
        user,
      },
      relations: ['user'],
    })

    if (!courier) {
      throw new BadRequestException(`Courier with id ${id} not found`)
    }

    return courier
  }

  async findByIdOrFail(id: number) {
    const courier = await this.courierRepository.findOne({
      where: { id },
    })

    if (!courier) {
      throw new BadRequestException(`Courier with id ${id} does not exist`)
    }

    return courier
  }

  isActive(courier: Courier) {
    if (!courier.isActive) {
      throw new BadRequestException('Courier is not active')
    }
  }

  create(input: CourierInputDto, user: User) {
    const courier = this.courierRepository.create(input)
    courier.user = user

    return this.courierRepository.save(courier)
  }

  async cancel(id: number, user: User) {
    const courier = await this.findByIdOrFail(id)

    if (courier.userId !== user.id) {
      throw new BadRequestException('You cannot cancel this order')
    }

    if (!courier.isActive) {
      throw new BadRequestException('Order already canceled')
    }

    // if courier already in process then wait until all sendOrders are served
    const isInProcess = await this.orderService.isCourierInProcess(courier)
    if (isInProcess) {
      throw new BadRequestException('Order is in process')
    }

    courier.isActive = false

    await this.courierRepository.save(courier)

    return true
  }
}
