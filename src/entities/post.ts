import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import { Category } from './category'
import BaseStatusEnum from '@enums/base.status.enum'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number

  @Column({ name: 'title', type: 'varchar', length: 500 })
  title: string

  @Column({ name: 'slug', type: 'varchar', length: 1000, unique: true })
  slug: string

  @Column({ name: 'description', type: 'varchar', length: 1000 })
  description: string

  @Column({ name: 'thumbnail', type: 'varchar', nullable: true })
  thumbnail?: string

  @Column({ name: 'content', type: 'text' })
  content: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.PUBLISHED })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => Category, (category) => category.posts, { cascade: true })
  @JoinTable({
    name: 'post_category',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[]
}
