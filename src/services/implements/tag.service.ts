import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import { inject, injectable } from 'inversify'
import BaseService from '@services/implements/base.service'
import { TYPES } from '@constants/types'
import { ILike } from 'typeorm'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'

@injectable()
export default class TagService extends BaseService<Tag> implements ITagService {
  constructor(@inject(TYPES.TagRepository) tagRepository: ITagRepository) {
    super(tagRepository)
  }

  async paginate(options: IQueryOptions<Tag>): Promise<IPaginationResult<Tag>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', orderBy = 'DESC' } = options

    const allowedSortFields: (keyof Tag)[] = ['id', 'name', 'createdAt', 'status']
    const sortField = allowedSortFields.includes(sortBy as keyof Tag) ? sortBy : 'createdAt'

    const findOptions: IQueryOptions<Tag> = {
      page,
      limit,
      sortBy: sortField as keyof Tag,
      orderBy,
      where: search ? { name: ILike(`%${search}%`) } : undefined
    }

    return super.findWithPagination(findOptions)
  }
}
