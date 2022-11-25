import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { City } from './city.entity'

@Entity({
  name: 'countries',
})
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255, nullable: false })
  name: string

  @OneToMany(() => City, (city) => city.country, { cascade: true })
  cities: City[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
