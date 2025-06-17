import { BASE_STATUS } from '@constants/base.status'
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany
} from 'typeorm'
import { Post } from '@entities/post'

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string

  @Column({ name: 'slug', type: 'varchar', unique: true })
  slug: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.PUBLISHED })
  status: string

  @ManyToMany(() => Post, post => post.tags, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  posts: Post[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
