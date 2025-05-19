import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'key', type: 'varchar', length: 255, unique: true })
  key: string

  @Column({ name: 'value', type: 'text' })
  value: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
