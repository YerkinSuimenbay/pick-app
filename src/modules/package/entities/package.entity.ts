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

import { PackageStatus } from '../enums'
import { User } from '../../user/entities'
import { FileEntity } from '../../file/entities'
import { PackageToCourier } from '../../order/entities'

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

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

  @OneToMany(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: 'image_ids' })
  images: FileEntity[] | null

  @Column('varchar')
  status: PackageStatus

  @OneToMany(
    () => PackageToCourier,
    (packageToCourier) => packageToCourier.package,
    { nullable: true },
  )
  packageToCouriers: PackageToCourier[] | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
