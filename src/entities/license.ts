import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'licenses' })
export class License {
  @PrimaryGeneratedColumn()
  id: string

  @Column('varchar')
  licensed_to: string

  @Column('date')
  activated_at: string

  @Column('date')
  expires_at: string

  @Column('text')
  token: string

  @Column({ type: 'varchar', length: 50 })
  status: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
