import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import { inject, injectable } from 'inversify'
import BaseService from '@services/implements/base.service'
import { TYPES } from '@constants/types'

@injectable()
export default class TagService extends BaseService<Tag> implements ITagService {
  constructor(@inject(TYPES.TagRepository) tagRepository: ITagRepository) {
    super(tagRepository)
  }
}
