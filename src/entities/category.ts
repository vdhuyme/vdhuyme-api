import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { BASE_STATUS } from '@constants/base.status'
import { Post } from '@entities/post'

@Entity('categories')
@Tree('closure-table', {
  ancestorColumnName: () => 'ancestor_id',
  descendantColumnName: () => 'descendant_id'
})
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', unique: true })
  name: string

  @Column({ name: 'thumbnail', type: 'varchar', nullable: true })
  thumbnail?: string | null

  @Column({ name: 'icon', type: 'varchar', nullable: true })
  icon?: string | null

  @Column({ name: 'slug', unique: true })
  slug: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.PUBLISHED })
  status: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null

  @TreeChildren({ cascade: true })
  children?: Category[]

  @TreeParent({ onDelete: 'SET NULL' })
  parent?: Category | null

  @Column({ name: 'type', type: 'varchar', length: 50, unique: true, default: 'post' })
  type: string

  @OneToMany(() => Post, post => post.category)
  posts: Post[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
