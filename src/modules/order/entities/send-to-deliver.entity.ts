import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Deliver } from '../../deliver/entities'
import { Send } from '../../send/entities'
import { SendToDeliverStatus } from '../enums'

@Entity({ name: 'sendToDelivers' })
@Unique(['sendId', 'deliverId'])
export class SendToDeliver {
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

  @Column('varchar', { default: SendToDeliverStatus.pending })
  status: SendToDeliverStatus
}
