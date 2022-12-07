import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Courier } from '../../courier/entities'
import { Package } from '../../package/entities'
import { Offer } from '../entities'
import { OfferedBy, OfferStatus } from '../enums'

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findByIdOrFail(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['package', 'package.user', 'courier', 'courier.user'],
    })

    if (!offer) {
      throw new BadRequestException('Offer not found')
    }

    return offer
  }

  async findByPackageIdAndCourierId(packageId: number, courierId: number) {
    this.offerRepository.find({
      where: {
        packageId,
        courierId,
      },
    })
  }

  async findByPackageIdAndOfferfedByCourier(
    packageId: number,
    offeredByCourier: OfferedBy,
  ) {
    return this.offerRepository.findAndCount({
      where: {
        packageId,
        offeredByCourier: offeredByCourier === OfferedBy.COURIER,
        status: OfferStatus.pending,
      },
      relations: [
        'courier',
        'courier.user',
        'courier.user.idImages',
        'courier.from',
        'courier.from.country',
        'courier.to',
        'courier.to.country',
      ],
    })
  }

  async findByCourierIdAndOfferfedByCourier(
    courierId: number,
    offeredByCourier: OfferedBy,
  ) {
    return this.offerRepository.findAndCount({
      where: {
        courierId,
        offeredByCourier: offeredByCourier === OfferedBy.COURIER,
        status: OfferStatus.pending,
      },
      relations: [
        'package',
        'package.images',
        'package.user',
        'package.user.idImages',
        'package.from',
        'package.from.country',
        'package.to',
        'package.to.country',
      ],
    })
  }

  bind(pack: Package, courier: Courier, offeredBy: OfferedBy) {
    const offer = this.offerRepository.create({
      package: pack,
      courier,
      offeredByCourier: offeredBy === OfferedBy.COURIER,
    })

    return this.offerRepository.save(offer)
  }

  async isPossible(packageId: number, courierId: number) {
    const offers = await this.offerRepository.find({
      where: {
        packageId,
        courierId,
      },
    })

    if (offers.length === 0) return true

    return offers.every((offer) => offer.status === OfferStatus.canceled)
  }

  changeStatus(offer: Offer, status: OfferStatus) {
    offer.status = status
    return this.offerRepository.save(offer)
  }

  async declinePendingsByPackage(pack: Package) {
    const offers = await this.offerRepository.find({
      where: {
        packageId: pack.id,
        status: OfferStatus.pending,
      },
    })
    offers.map((offer) => (offer.status = OfferStatus.declined))
    return this.offerRepository.save(offers)
  }

  async cancelOffersByPackageId(packageId: number) {
    const offers = await this.offerRepository.find({
      where: { packageId },
    })

    offers.map((offer) => (offer.status = OfferStatus.canceled))
    await this.offerRepository.save(offers)
  }

  async cancelOffersByCourierId(courierId: number) {
    const offers = await this.offerRepository.find({
      where: { courierId },
    })

    offers.map((offer) => (offer.status = OfferStatus.canceled))
    await this.offerRepository.save(offers)
  }
}
