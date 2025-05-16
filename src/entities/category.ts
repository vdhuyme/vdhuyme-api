import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import BaseStatusEnum from '@enums/base.status.enum'
import { Post } from '@entities/post'

@Entity('categories')
@Tree('nested-set')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', unique: true })
  name: string

  @Column({ name: 'thumbnail', type: 'varchar', nullable: true })
  thumbnail?: string

  @Column({ name: 'icon', type: 'varchar', nullable: true })
  icon?: string

  @Column({ name: 'slug', unique: true })
  slug: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.PUBLISHED })
  status: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string

  @TreeChildren({ cascade: true })
  children: Category[]

  @TreeParent({ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null

  @ManyToMany(() => Post, post => post.categories)
  posts: Post[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
