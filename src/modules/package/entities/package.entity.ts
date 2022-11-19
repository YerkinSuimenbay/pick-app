import { Order } from './../../order/entities/order.entity'
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

import { PackageStatus } from '../enums'
import { User } from '../../user/entities'
import { FileEntity } from '../../file/entities'
import { PackageToCourier } from '../../order/entities'

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', nullable: true })
  userId: number | null

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  @Column()
  from: string

  @Column()
  to: string

  @Column({ name: 'send_date' })
  sendDate: Date

  @Column({ name: 'delivery_date' })
  deliveryDate: Date

  @Column({ nullable: true })
  fee: number | null

  @Column({ nullable: true })
  comment: string | null

  @Column()
  contents: string

  @Column({ nullable: true })
  weight: number | null

  @OneToMany(() => FileEntity, (file) => file.packageImage, { nullable: true })
  // @JoinColumn({ name: 'image_ids' })
  images: FileEntity[] | null

  @Column('varchar', { default: PackageStatus.new })
  status: PackageStatus

  @OneToMany(
    () => PackageToCourier,
    (packageToCourier) => packageToCourier.package,
    { nullable: true },
  )
  packageToCouriers: PackageToCourier[] | null

  @OneToOne(() => Order, (order) => order.package, { nullable: true })
  order: Order | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
