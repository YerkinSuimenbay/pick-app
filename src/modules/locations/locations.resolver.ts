import { Resolver, Query, Args } from '@nestjs/graphql'

import { LocationsService } from './locations.service'
import { ICountriesResponse, ICitiesResponse } from './interfaces'
import { CitiesFilterDto } from './dto'

import { Pagination } from '../../common/decorators'
import { PaginationDto } from '../../common/dto'

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationService: LocationsService) {}

  @Query()
  async countries(): Promise<ICountriesResponse> {
    const [countries, total] = await this.locationService.getCountries()

    return {
      total,
      countries,
    }
  }

  @Query()
  async cities(
    @Args('filter') filter: CitiesFilterDto,
    @Pagination() pagination: PaginationDto,
  ): Promise<ICitiesResponse> {
    const [cities, total] = await this.locationService.getCities({
      filter,
      pagination,
    })

    return {
      total,
      cities,
    }
  }
}
