import { City } from '../entities'

export interface ICitiesResponse {
  cities: City[]
  total: number
}
