import BaseStatusEnum from '@enums/base.status.enum'
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'licenses' })
export class License {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'licensed_to', type: 'varchar', length: 255 })
  licensedTo: string

  @Column({ name: 'activated_at', type: 'date' })
  activatedAt: string

  @Column({ name: 'expires_at', type: 'date' })
  expiresAt: string

  @Column({ name: 'token', type: 'text' })
  token: string

  @Column({ name: 'status', type: 'varchar', length: 50, default: BaseStatusEnum.ACTIVATED })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
