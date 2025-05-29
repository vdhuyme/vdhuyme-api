import { TYPES } from '@constants/types'
import { User } from '@entities/user'
import { IUserResponse, UserResource } from '@mappers/user.mapper'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import { IUserService } from '@services/contracts/user.service.interface'
import BaseService from '@services/implements/base.service'
import { inject, injectable } from 'inversify'
import { FindOptionsWhere, ILike } from 'typeorm'

@injectable()
export default class UserService extends BaseService<User> implements IUserService {
  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    super(userRepository)
  }

  async paginate(options: IQueryOptions<User>): Promise<IPaginationResult<IUserResponse>> {
    const { search, sort, ...rest } = options

    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined = search
      ? [{ name: ILike(`%${search}%`) }]
      : rest.where
    const allowedSortFields: (keyof User)[] = ['id', 'name', 'createdAt', 'status']
    const order = this.buildOrder(sort, allowedSortFields)

    const { items, meta } = await super.findWithPagination({ ...rest, where, order })
    return { items: UserResource.collection(items) as User[], meta }
  }
}
