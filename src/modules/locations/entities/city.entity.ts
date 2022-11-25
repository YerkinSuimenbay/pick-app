import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Country } from './country.entity'

@Entity({
  name: 'cities',
})
export class City {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  geonameid: number

  @Column({ length: 255, nullable: false })
  name: string

  @Column({ length: 255, nullable: true })
  subcountry: string | null

  @ManyToOne(() => Country, (country) => country.cities, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country: Country

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
