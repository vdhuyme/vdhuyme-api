import fs from 'fs'

import { storage } from '@utils/storage'

const permissionsPath = storage.storagePath('data/roles-permissions.json')

export const ROLES_PERMISSIONS: Record<string, string[]> = JSON.parse(
  fs.readFileSync(permissionsPath, 'utf-8')
)
