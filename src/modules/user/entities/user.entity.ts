import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ColumnNumericTransformer } from '../../../common/transformers/'
import { SocialProvider } from '../../auth/socials/enums'
import { FileEntity } from '../../file/entities'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true, nullable: true })
  phone: string | null

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  description: string | null

  @Column({ nullable: true })
  password: string | null

  @Column({ name: 'social_id', nullable: true })
  socialId: string | null

  @Column('varchar', { nullable: true })
  socialProvider: SocialProvider | null

  @Column({ name: 'id_type', nullable: true })
  idType: string | null

  @Column({ name: 'id_number', nullable: true })
  idNumber: string | null

  @OneToMany(() => FileEntity, (file) => file.userIdImage, { nullable: true })
  @JoinColumn({ name: 'id_images_ids' })
  idImages: FileEntity[] | null

  @OneToOne(() => FileEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: FileEntity | null

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

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'favorite_id',
      referencedColumnName: 'id',
    },
  })
  favorites: User[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
