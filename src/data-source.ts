import logger from '@config/logging'
import { DataSource, DataSourceOptions } from 'typeorm'
import { NodeEnvironment } from 'types'

const env = (process.env.NODE_ENV || 'development') as NodeEnvironment

const basePath = __dirname

const config: Record<NodeEnvironment, DataSourceOptions> = {
  development: {
    type: 'sqlite',
    database: `${basePath}/storage/data/development.sqlite`,
    synchronize: true,
    logging: true,
    entities: [`${basePath}/entities/**/*{.ts,.js}`],
    migrations: [`${basePath}/migrations/**/*{.ts,.js}`]
  },
  production: {
    type: 'sqlite',
    database: `${basePath}/storage/data/production.sqlite`,
    synchronize: false,
    logging: false,
    entities: [`${basePath}/entities/**/*{.ts,.js}`],
    migrations: [`${basePath}/migrations/**/*{.ts,.js}`]
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [`${basePath}/entities/**/*{.ts,.js}`],
    migrations: []
  }
}

export const db = new DataSource(config[env])

export const database = async (): Promise<void> => {
  try {
    await db.initialize()
    logger.info(`[${env}]📦 SQLite database connected`)
  } catch (error: any) {
    logger.error(`❌ Failed to connect with SQLite: ${error}`)
  }
}
