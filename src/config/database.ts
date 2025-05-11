import BaseStatusEnum from '@enums/base.status.enum'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'

export interface Post {
  id: string
  title: string
  description: string
  thumbnail?: string
  images?: string[]
  content: string
  status: BaseStatusEnum
  createdAt: string
  updatedAt: string
}

export interface License {
  id: string
  licensedTo: string
  activatedAt: string
  expiresAt?: string
  token: string
  createdAt: string
  updatedAt: string
}

interface DatabaseSchemas {
  posts: Post[]
  licenses: License[]
}

const defaultData: DatabaseSchemas = {
  posts: [],
  licenses: []
}

const file = path.join(__dirname, '../../database.json')
const adapter = new JSONFile<DatabaseSchemas>(file)
const db = new Low<DatabaseSchemas>(adapter, defaultData)

const database = async (): Promise<void> => {
  await db.read()
  db.data ||= defaultData
  await db.write()
}

export { db, database }
