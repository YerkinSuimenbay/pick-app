import { BadRequestException, Injectable } from '@nestjs/common'
import { FindOptionsWhere, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { OrderService } from '../../order/services/order.service'
import { CourierInputDto } from '../dto/courier-input.dto'
import { User } from '../../user/entities'
import { Courier } from '../entities'
import { CouriersFilterDto } from '../dto'
import { LocationsService } from '../../locations/locations.service'

@Injectable()
export class CourierService {
  constructor(
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
    private readonly orderService: OrderService,
    private readonly locationsService: LocationsService,
  ) {}

  find({ filter }: { filter?: CouriersFilterDto }) {
    const { fromId, toId, startDate, endDate } = filter || {}

    const qb = this.courierRepository
      .createQueryBuilder('courier')
      .innerJoinAndSelect('courier.from', 'fromCity')
      .innerJoinAndSelect('fromCity.country', 'fromCityCountry')
      .innerJoinAndSelect('courier.to', 'toCity')
      .innerJoinAndSelect('toCity.country', 'toCityCountry')
      .innerJoinAndSelect('courier.user', 'user')
      .leftJoinAndSelect('user.idImages', 'idImages') // TODO: innerJoin

    if (fromId) {
      qb.andWhere('fromCity.id = :fromId', { fromId })
    }
    if (toId) {
      qb.andWhere('toCity.id = :toId', { toId })
    }
    if (endDate) {
      qb.andWhere('courier.startDate <= :endDate', { endDate })
    }
    if (startDate) {
      qb.andWhere('courier.endDate >= :startDate', { startDate })
    }

    return qb.getManyAndCount()
  }

  async findByIdAndUserOrFail(user: User, id: number) {
    const courier = await this.courierRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
      relations: [
        'user',
        'user.idImages',
        'from',
        'from.country',
        'to',
        'to.country',
      ],
    })

    if (!courier) {
      throw new BadRequestException(`Courier with id ${id} not found`)
    }

    return courier
  }

  async findByIdOrFail(id: number) {
    const courier = await this.courierRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.idImages',
        'from',
        'from.country',
        'to',
        'to.country',
      ],
    })

    if (!courier) {
      throw new BadRequestException(`Courier with id ${id} does not exist`)
    }

    return courier
  }

  findByUserId({ userId, isActive }: { userId: number; isActive?: boolean }) {
    const where: FindOptionsWhere<Courier> | FindOptionsWhere<Courier>[] = {
      userId,
    }
    if (isActive != null) {
      where.isActive = isActive
    }

    return this.courierRepository.findAndCount({
      where,
      relations: [
        'user',
        'user.idImages',
        'orders',
        'orders.package',
        'orders.package.images',
        'orders.package.user',
        'orders.package.user.idImages',
        'from',
        'from.country',
        'to',
        'to.country',
      ],
    })
  }

  isActive(courier: Courier) {
    if (!courier.isActive) {
      throw new BadRequestException('Courier is not active')
    }
  }

  async create(input: CourierInputDto, user: User) {
    const { fromId, toId, ...courierInput } = input

    const fromCity = await this.locationsService.findCityByIdOrFail(fromId)
    const toCity = await this.locationsService.findCityByIdOrFail(toId)

    const courier = this.courierRepository.create(courierInput)
    courier.user = user
    courier.from = fromCity
    courier.to = toCity

    return this.courierRepository.save(courier)
  }

  async cancel(id: number, user: User) {
    const courier = await this.findByIdAndUserOrFail(user, id)

    if (!courier.isActive) {
      throw new BadRequestException('Courier already canceled')
    }

    // if courier already in process then wait until all sendOrders are served
    const isInProcess = await this.orderService.isCourierInProcess(courier)
    if (isInProcess) {
      throw new BadRequestException('Courier is in process')
    }

    courier.isActive = false

    await this.courierRepository.save(courier)

    return true
  }
}
