import { User } from '@entities/user'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { IBaseService } from '@services/contracts/base.service.interface'

export interface IUserService extends IBaseService<User> {
  paginate(options: IQueryOptions<User>): Promise<IPaginationResult<User>>
}
