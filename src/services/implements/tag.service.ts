import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import { inject, injectable } from 'inversify'
import BaseService from '@services/implements/base.service'
import { TYPES } from '@constants/types'
import { FindOptionsWhere, ILike } from 'typeorm'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'

@injectable()
export default class TagService extends BaseService<Tag> implements ITagService {
  constructor(@inject(TYPES.TagRepository) tagRepository: ITagRepository) {
    super(tagRepository)
  }

  async paginate(options: IQueryOptions<Tag>): Promise<IPaginationResult<Tag>> {
    const { search, sort, ...rest } = options

    const where: FindOptionsWhere<Tag> | FindOptionsWhere<Tag>[] | undefined = search
      ? [{ name: ILike(`%${search}%`) }]
      : rest.where
    const allowedSortFields: (keyof Tag)[] = ['id', 'name', 'createdAt', 'status']
    const order = this.buildOrder(sort, allowedSortFields)

    return super.findWithPagination({ ...rest, where, order })
  }
}
