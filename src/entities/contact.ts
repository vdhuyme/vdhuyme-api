import { BASE_STATUS } from '@constants/base.status'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'contacts' })
export class Contact {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name?: string | null

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string

  @Column({ name: 'message', type: 'text', nullable: true })
  message?: string | null

  @Column({ name: 'status', type: 'varchar', length: 50, default: BASE_STATUS.PENDING })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
