import bcrypt from 'bcryptjs'

const SALT = parseInt(process.env.SALT as string | '10', 10)

export const Hash = {
  make(plain: string): string {
    return bcrypt.hashSync(plain, SALT)
  },

  check(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash)
  }
}
