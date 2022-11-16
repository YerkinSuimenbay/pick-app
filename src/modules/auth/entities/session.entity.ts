import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../../user/entities'

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'session_token' })
  sessionToken: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'last_login_at' })
  lastLoginAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
