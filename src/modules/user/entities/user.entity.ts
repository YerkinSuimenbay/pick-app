import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ColumnNumericTransformer } from '../../../common/transformers/'
import { FileEntity } from '../../file/entities'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  phone: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  description: string | null

  @Column()
  password: string

  @Column({ name: 'id_type' })
  idType: string

  @Column({ name: 'id_number' })
  idNumber: string

  @OneToMany(() => FileEntity, (file) => file.userIdImage, { nullable: true })
  @JoinColumn({ name: 'id_images_ids' })
  idImages: FileEntity[] | null

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({
    name: 'rating_as_courier',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  ratingAsCourier: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
