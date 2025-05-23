import { BASE_STATUS } from '@constants/base.status'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Post } from '@entities/post'
import { Comment } from '@entities/comment'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  avatar?: string | null

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ name: 'phone_number', type: 'varchar', length: 50, nullable: true })
  phoneNumber?: string | null

  @Column({ name: 'dob', type: 'date', nullable: true })
  dob?: string | null

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.ACTIVATED })
  status: string

  @Column({ name: 'super_user', type: 'boolean', default: 0 })
  superUser: number

  @OneToMany(() => Post, post => post.author, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  posts: Post[]

  @OneToMany(() => Comment, comment => comment.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  comments: Comment[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
