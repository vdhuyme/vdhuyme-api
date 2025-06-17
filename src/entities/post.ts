import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm'
import { BASE_STATUS } from '@constants/base.status'
import { User } from '@entities/user'
import { Category } from '@entities/category'
import { Tag } from '@entities/tag'
import { Comment } from '@entities/comment'

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

  @Column({ name: 'read_time', type: 'int', nullable: true })
  readTime?: number | null

  @Column({ name: 'views', type: 'int', default: 0 })
  views: number

  @ManyToOne(() => Category, category => category.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'auth_id' })
  author: User

  @ManyToMany(() => Tag, tag => tag.posts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'post_tag',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[]

  @OneToMany(() => Comment, comment => comment.post, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  comments: Comment[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
