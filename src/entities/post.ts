import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column({ nullable: true })
  thumbnail?: string

  @Column('simple-array', { nullable: true })
  images?: string[]

  @Column('text')
  content: string

  @Column('varchar')
  status: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
