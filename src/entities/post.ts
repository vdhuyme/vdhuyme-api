import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import BaseStatusEnum from '@enums/base.status.enum'
import { User } from '@entities/user'

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

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.PUBLISHED })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'auth_id' })
  author: User
}
