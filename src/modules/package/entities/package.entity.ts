import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Order } from './../../order/entities/order.entity'

import { PackageStatus } from '../enums'
import { User } from '../../user/entities'
import { FileEntity } from '../../file/entities'
import { Offer } from '../../order/entities'
import { City } from '../../locations/entities'

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', nullable: true })
  userId: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  @OneToOne(() => City)
  @JoinColumn()
  from: City

  @OneToOne(() => City)
  @JoinColumn()
  to: City

  @Column({ name: 'start_date' })
  startDate: Date

  @Column({ name: 'end_date' })
  endDate: Date

  @Column({ nullable: true })
  fee: number | null

  @Column({ nullable: true })
  comment: string | null

  @Column()
  contents: string

  @Column({ nullable: true })
  weight: number | null

  @OneToMany(() => FileEntity, (file) => file.packageImage, { nullable: true })
  images: FileEntity[] | null

  @Column('varchar', { default: PackageStatus.new })
  status: PackageStatus

  @OneToMany(() => Offer, (offer) => offer.package, {
    nullable: true,
  })
  offers: Offer[] | null

  @OneToOne(() => Order, (order) => order.package, { nullable: true })
  order: Order | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
