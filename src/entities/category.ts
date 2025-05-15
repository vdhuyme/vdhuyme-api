import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  ManyToMany
} from 'typeorm'
import { Post } from './post'
import BaseStatusEnum from '@enums/base.status.enum'

@Entity('categories')
@Tree('nested-set')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', unique: true })
  name: string

  @Column({ name: 'slug', unique: true })
  slug: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.PUBLISHED })
  status: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string

  @TreeChildren()
  children: Category[]

  @TreeParent()
  parent: Category

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[]
}
