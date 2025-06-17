/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import path from 'path'

import logger from '@config/logging'
import { DataSource, DataSourceOptions } from 'typeorm'
import { NodeEnvironment } from 'types'
import { config } from '@config/app'

const env = config.app.env
const basePath: string = __dirname

const databaseConfig: Record<NodeEnvironment, DataSourceOptions> = {
  development: {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [path.join(basePath, 'migrations', '**', '*{.ts,.js}')],
    subscribers: [path.join(basePath, 'subscribers', '**', '*{.ts,.js}')]
  },
  production: {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    ssl: config.database.ssl,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [path.join(basePath, 'migrations', '**', '*{.ts,.js}')],
    subscribers: [path.join(basePath, 'subscribers', '**', '*{.ts,.js}')]
  },
  test: {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    entities: [path.join(basePath, 'entities', '**', '*{.ts,.js}')],
    migrations: [],
    subscribers: []
  }
}

export const dataSource = new DataSource(databaseConfig[env])

export const database = async (): Promise<void> => {
  try {
    await dataSource.initialize()
    logger.info(
      `📂 [${env.toUpperCase()}] Connected to ${config.database.connection.toUpperCase()} → ${databaseConfig[env].database}`
    )
  } catch (error: any) {
    logger.error(`❌ Failed to connect with ${config.database.connection}: ${error.message}`)
    logger.error(`Stack trace: ${error.stack}`)
    throw error
  }
}
