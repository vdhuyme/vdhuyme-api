import { User } from '@entities/user'
import { IBaseService } from '@services/contracts/base.service.interface'

export type IUserService = IBaseService<User>
