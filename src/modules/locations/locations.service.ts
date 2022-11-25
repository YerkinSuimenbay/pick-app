import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
  }: {
    filter?: CitiesFilterDto
  }): Promise<[City[], number]> {
    const { search } = filter || {}

    const qb = this.citiesRepository
      .createQueryBuilder('city')
      .innerJoinAndSelect('city.country', 'country')

    if (search) {
      qb.andWhere(
        'city.name ILIKE :search OR city.subcountry ILIKE :search OR country.name ILIKE :search',
        {
          search: `%${search.toLowerCase()}%`,
        },
      )
    }

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
