import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'

export default class TagRepository extends BaseRepository<Tag> implements ITagRepository {
  constructor() {
    super(Tag, dataSource)
  }
}
