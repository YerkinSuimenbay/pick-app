import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PackageToCourier } from '../../order/entities'
import { User } from '../../user/entities'

@Entity({ name: 'couriers' })
export class Courier {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  // status: if user has incomplete courier cannot create new

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column()
  from: string

  @Column()
  to: string

  @Column()
  date: Date

  @Column({ nullable: true })
  flight: string | null

  @Column({ nullable: true })
  fee: number | null

  @Column({ nullable: true })
  comment: string | null

  @Column({ name: 'maximum_weight', nullable: true })
  maximumWeight: number | null

  @OneToMany(
    () => PackageToCourier,
    (packageToCourier) => packageToCourier.courier,
    { nullable: true },
  )
  packageToCouriers: PackageToCourier[] | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
