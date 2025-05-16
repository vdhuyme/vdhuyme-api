import BaseStatusEnum from '@enums/base.status.enum'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { Post } from '@entities/post'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.ACTIVATED })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Post, post => post.author)
  posts: Post[]
}
