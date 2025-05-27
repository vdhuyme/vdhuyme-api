import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import { inject } from 'inversify'
import { TYPES } from 'inversify-config'
import BaseService from '@services/implements/base.service'

export default class TagService extends BaseService<Tag> implements ITagService {
  constructor(@inject(TYPES.TagRepository) tagRepository: ITagRepository) {
    super(tagRepository)
  }
}
