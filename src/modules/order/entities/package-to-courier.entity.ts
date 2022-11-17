import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Courier } from '../../courier/entities'
import { Package } from '../../package/entities'
import { PackageToCourierStatus } from '../enums'

@Entity({ name: 'packageToCouriers' })
@Unique(['packageId', 'courierId'])
export class PackageToCourier {
  @PrimaryGeneratedColumn()
  id: number

  // PACKAGE ORDER
  @Column({ name: 'package_id', nullable: true })
  packageId: number | null

  @ManyToOne(() => Package, (pack) => pack.packageToCouriers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'package_id' })
  package: Package | null

  // COURIER ORDER
  @Column({ name: 'courier_id', nullable: true })
  courierId: number | null

  @ManyToOne(() => Courier, (courier) => courier.packageToCouriers, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'courier_id' })
  courier: Courier | null

  @Column('varchar', { default: PackageToCourierStatus.pending })
  status: PackageToCourierStatus
}
