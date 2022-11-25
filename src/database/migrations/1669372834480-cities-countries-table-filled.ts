import { MigrationInterface, QueryRunner } from 'typeorm'

import * as fs from 'fs'
import { join } from 'path'

import { City, Country } from '../../modules/locations/entities'

const content = fs.readFileSync(
  join(__dirname, '../seeds/world-cities_json.json'),
  {
    encoding: 'utf-8',
  },
)
interface ILocation {
  country: string
  geonameid: number
  name: string
  subcountry: string
}
const cities: ILocation[] = JSON.parse(content)

export class citiesCountriesTableFilled1669372834480
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const city of cities) {
      let country = await queryRunner.manager
        .createQueryBuilder(Country, 'country')
        .where('country.name = :country', { country: city.country })
        .getOne()

      if (country == null) {
        country = queryRunner.manager.create(Country, {
          name: city.country,
        })

        country = await queryRunner.manager.save(Country, country)
      }

      const newCity = queryRunner.manager.create(City, {
        geonameid: city.geonameid,
        name: city.name,
        subcountry: city.subcountry,
        country,
      })

      await queryRunner.manager.save(City, newCity)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "countries"`)
  }
}
