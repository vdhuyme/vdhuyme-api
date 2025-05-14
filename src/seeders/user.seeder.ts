import 'dotenv/config'
import { User } from '@entities/user'
import { Seeder } from '@jorgebodega/typeorm-seeding'
import { DataSource } from 'typeorm'
import bcrypt from 'bcryptjs'
import BaseStatusEnum from '@enums/base.status.enum'

export default class UserSeeder extends Seeder {
  async run(ds: DataSource) {
    try {
      const email: string = process.env.DEFAULT_USER_EMAIL as string
      const password: string = process.env.DEFAULT_USER_PASSWORD as string

      if (!email || !password) {
        throw new Error('Missing email or password in environment variables')
      }

      const user = new User()
      user.id = 1
      user.name = 'Vo Duc Huy'
      user.email = email
      user.password = bcrypt.hashSync(password, 10)
      user.status = BaseStatusEnum.ACTIVATED
      user.created_at = new Date()
      user.updated_at = new Date()

      await ds.getRepository<User>(User).save(user)
    } catch (error) {
      throw error
    }
  }
}
