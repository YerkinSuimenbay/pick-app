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
import { SendToDeliver } from '../../order/entities'

import { User } from '../../user/entities'

@Entity({ name: 'delivers' })
export class Deliver {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  // status: if user has incomplete deliver cannot create new

  @Column()
  active: boolean

  @Column()
  from: string

  @Column()
  to: string

  @Column()
  date: Date

  @Column()
  flight: string

  @Column()
  fee: number

  @Column({ nullable: true })
  comment: string | null

  @Column({ name: 'maximum_weight' })
  maximumWeight: number

  @OneToMany(() => SendToDeliver, (sendToDeliver) => sendToDeliver.deliver)
  sendToDelivers: SendToDeliver[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
