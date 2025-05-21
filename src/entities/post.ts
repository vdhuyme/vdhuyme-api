import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { BASE_STATUS } from '@constants/base.status'
import { User } from '@entities/user'

import { Category } from './category'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string

  @Column({ name: 'slug', type: 'varchar', length: 1000, unique: true })
  slug: string

  @Column({ name: 'excerpt', type: 'varchar', length: 1000 })
  excerpt: string

  @Column({ name: 'thumbnail', type: 'varchar', nullable: true })
  thumbnail?: string | null

  @Column({ name: 'content', type: 'text' })
  content: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.PUBLISHED })
  status: string

  @ManyToOne(() => Category, category => category.posts)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'auth_id' })
  author: User
}
