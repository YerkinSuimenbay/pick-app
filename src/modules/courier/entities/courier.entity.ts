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

import { Offer } from '../../order/entities'
import { User } from '../../user/entities'
import { City } from '../../locations/entities'

@Entity({ name: 'couriers' })
export class Courier {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', nullable: true })
  userId: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  // status: if user has incomplete courier cannot create new

  @Column({ name: 'is_active', default: true })
  isActive: boolean

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
  flight: string | null

  @Column({ nullable: true })
  fee: number | null

  @Column({ nullable: true })
  comment: string | null

  @Column({ name: 'maximum_weight', nullable: true })
  maximumWeight: number | null

  @OneToMany(() => Offer, (offer) => offer.courier, { nullable: true })
  offers: Offer[] | null

  @OneToMany(() => Order, (order) => order.courier, { nullable: true })
  orders: Order[] | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
