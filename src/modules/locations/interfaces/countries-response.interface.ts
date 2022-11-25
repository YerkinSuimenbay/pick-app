import { Country } from '../entities'

export interface ICountriesResponse {
  countries: Country[]
  total: number
}
