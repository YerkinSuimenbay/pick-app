import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Package } from '../../package/entities/package.entity'
import { Courier } from '../../courier/entities'

@Entity({ name: 'orders' })
@Unique(['packageId', 'courierId'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'package_id' })
  packageId: number

  @ManyToOne(() => Package, (pack) => pack.packageToCouriers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'package_id' })
  package: Package | null

  @Column({ name: 'courier_id' })
  courierId: number

  @ManyToOne(() => Courier, (courier) => courier.packageToCouriers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'courier_id' })
  courier: Courier | null

  @Column({ name: 'ordered_by_courier' })
  orderedByCourier: boolean

  @Column({ name: 'pick_up_date', nullable: true })
  pickUpDate: Date | null

  @Column({ name: 'intransit_date', nullable: true })
  intransitDate: Date | null

  @Column({ name: 'delivered_date', nullable: true })
  deliveredDate: Date | null

  @Column({ name: 'canceled_date', nullable: true })
  canceledDate: Date | null

  @Column({ nullable: true })
  rating: number | null // 1 2 3 4 5

  @Column({ nullable: true })
  comment: string | null
}
