import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Courier } from '../../courier/entities'
import { Package } from '../../package/entities'
import { OfferStatus } from '../enums'

@Entity({ name: 'offers' })
// @Unique(['packageId', 'courierId'])
export class Offer {
  @PrimaryGeneratedColumn()
  id: number

  // PACKAGE ORDER
  @Column({ name: 'package_id', nullable: true }) // ?: nullable: false
  packageId: number | null

  @ManyToOne(() => Package, (pack) => pack.offers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'package_id' })
  package: Package | null

  // COURIER ORDER
  @Column({ name: 'courier_id', nullable: true })
  courierId: number | null

  @ManyToOne(() => Courier, (courier) => courier.offers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'courier_id' })
  courier: Courier | null

  @Column({ name: 'offered_by_courier' })
  offeredByCourier: boolean

  @Column('varchar', { default: OfferStatus.pending })
  status: OfferStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
