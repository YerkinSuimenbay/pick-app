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

import { SendStatus } from '../enums'
import { User } from '../../user/entities'
import { FileEntity } from '../../file/entities'
import { SendToDeliver } from '../../order/entities'

@Entity({ name: 'sends' })
export class Send {
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

  @Column()
  fee: number

  @Column({ nullable: true })
  comment: string | null

  @Column({ name: 'package_contents' })
  packageContents: string

  @Column({ name: 'package_weight' })
  packageWeight: number

  @Column({ name: 'package_image_id' })
  packageImageId: number

  @OneToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_image_id' })
  packageImage: FileEntity

  @Column('varchar')
  status: SendStatus

  @OneToMany(() => SendToDeliver, (sendToDeliver) => sendToDeliver.send)
  sendToDelivers: SendToDeliver[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
