import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import BaseStatusEnum from '@enums/base.status.enum'

@Entity('categories')
@Tree('closure-table')
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

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.PUBLISHED })
  status: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null

  @TreeChildren({ cascade: true })
  children?: Category[]

  @TreeParent({ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
