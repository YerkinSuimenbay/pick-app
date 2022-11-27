import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PaginationDto } from './../../common/dto/pagination.dto'
import { CitiesFilterDto } from './dto'
import { Country, City } from './entities'

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async getCountries(): Promise<[Country[], number]> {
    return this.countriesRepository.findAndCount()
  }

  async getCities({
    filter,
    pagination,
  }: {
    filter?: CitiesFilterDto
    pagination?: PaginationDto
  }): Promise<[City[], number]> {
    const { search } = filter || {}
    const { limit, offset } = pagination || {}

    const qb = this.citiesRepository
      .createQueryBuilder('city')
      .innerJoinAndSelect('city.country', 'country')

    if (search) {
      qb.andWhere('city.name ILIKE :search', {
        search: `%${search.toLowerCase()}%`,
      })
    }

    if (limit) {
      qb.take(limit)
    }

    if (offset) {
      qb.skip(offset)
    }

    qb.orderBy('city.name', 'ASC')

    return qb.getManyAndCount()
  }

  async findCityByIdOrFail(id: number): Promise<City> {
    const city = await this.citiesRepository.findOne({
      where: { id },
      relations: ['country'],
    })

    if (!city) {
      throw new Error('City not found')
    }

    return city
  }
}
