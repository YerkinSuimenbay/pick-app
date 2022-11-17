import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Package } from '../../package/entities'
import { User } from '../../user/entities'

@Entity({ name: 'files' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  path: string

  @Column()
  extension: string

  @Column()
  size: number

  @Column({ name: 'mime_type' })
  mimeType: string

  // USER: ID IMAGE
  @Column({ name: 'user_id', nullable: true })
  userId: number | null

  @ManyToOne(() => User, (user) => user.idImages, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  // SEND: PACKAGE IMAGE
  @Column({ name: 'package_image_id', nullable: true })
  packageImageId: number | null

  @ManyToOne(() => Package, (pack) => pack.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'package_image_id' })
  packageImage: Package | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
