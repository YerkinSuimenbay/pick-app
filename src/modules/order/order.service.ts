import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PackageToCourier } from './entities'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PackageToCourier)
    private readonly packageToCourierRepository: Repository<PackageToCourier>,
  ) {}

  create(packageId: number, courierId: number) {
    const sendToDeliver = this.packageToCourierRepository.create({
      packageId,
      courierId,
    })

    return this.packageToCourierRepository.save(sendToDeliver)
  }
}
