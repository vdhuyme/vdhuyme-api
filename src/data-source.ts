/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import path from 'path'

import logger from '@config/logging'
import { DataSource, DataSourceOptions } from 'typeorm'
import { NodeEnvironment } from 'types'

const env = (process.env.NODE_ENVIRONMENT || 'development') as NodeEnvironment

const basePath: string = __dirname

const config: Record<NodeEnvironment, DataSourceOptions> = {
  development: {
    type: 'sqlite',
    database: 'development.sqlite',
    synchronize: true,
    logging: true,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [path.join(basePath, 'migrations', '**', '*{.ts,.js}')],
    subscribers: [path.join(basePath, 'subscribers', '**', '*{.ts,.js}')]
  },
  production: {
    type: 'sqlite',
    database: 'production.sqlite',
    synchronize: true,
    logging: true,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [path.join(basePath, 'migrations', '**', '*{.ts,.js}')],
    subscribers: [path.join(basePath, 'subscribers', '**', '*{.ts,.js}')]
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [],
    subscribers: []
  }
}

logger.info(`Database configuration for ${env}:`, {
  database: config[env].database,
  entities: config[env].entities,
  migrations: config[env].migrations
})

export const db = new DataSource(config[env])

export const database = async (): Promise<void> => {
  try {
    await db.initialize()
    logger.info(`[${env}]📦 SQLite database connected`)

    logger.info(`Connected to database: ${config[env].database}`)
  } catch (error: any) {
    logger.error(`❌ Failed to connect with SQLite: ${error.message}`)
    logger.error(`Stack trace: ${error.stack}`)
    throw error
  }
}
