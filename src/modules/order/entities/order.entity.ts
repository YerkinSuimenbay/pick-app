import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Send } from '../../send/entities/send.entity'
import { Deliver } from '../../deliver/entities'

@Entity({ name: 'orders' })
@Unique(['sendId', 'deliverId'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'send_id' })
  sendId: number

  @Column({ name: 'deliver_id' })
  deliverId: number

  @ManyToOne(() => Send, (send) => send.sendToDelivers)
  @JoinColumn({ name: 'send_id' })
  send: Send

  @ManyToOne(() => Deliver, (deliver) => deliver.sendToDelivers)
  @JoinColumn({ name: 'deliver_id' })
  deliver: Deliver
}
