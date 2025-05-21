import { BASE_STATUS } from '@constants/base.status'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'tags' })
export class Setting {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'key', type: 'varchar', length: 255, unique: true })
  name: string

  @Column({ name: 'slug', type: 'varchar', length: 1000, unique: true })
  slug: string

  @Column({ name: 'type', type: 'varchar', length: 50, unique: true, default: 'post' })
  type: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.ACTIVATED })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
