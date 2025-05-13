import logger from '@config/logging'
import { DataSource } from 'typeorm'

export const db = new DataSource({
  type: 'sqlite',
  database: 'src/data/database.db',
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}']
})

export const database = async (): Promise<DataSource | undefined> => {
  try {
    await db.initialize()
    logger.info('📦 SQLite database connected')
    return db
  } catch (error: any) {
    logger.error(`❌ Failed to connect with SQLite: ${error.message}`)
  }
}
