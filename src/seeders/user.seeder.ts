import { User } from '@entities/user'
import { Seeder } from '@jorgebodega/typeorm-seeding'
import { DataSource } from 'typeorm'
import bcrypt from 'bcryptjs'
import BaseStatusEnum from '@enums/base.status.enum'

export default class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const user: User = {
      id: 1,
      name: 'Vo Duc Huy',
      password: bcrypt.hashSync(process.env.SUPER_USER_PWD as string, 10),
      email: process.env.SUPER_USER as string,
      status: BaseStatusEnum.APPROVED,
      created_at: new Date(),
      updated_at: new Date()
    }
    await dataSource.createEntityManager().save<User>(user)
  }
}
