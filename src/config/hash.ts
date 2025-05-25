import bcrypt from 'bcryptjs'
import { config } from '@config/app'

export const Hash = {
  make(plain: string): string {
    return bcrypt.hashSync(plain, config.hash.salt)
  },

  check(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash)
  }
}
