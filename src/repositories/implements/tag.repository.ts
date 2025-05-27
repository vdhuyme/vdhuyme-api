import { TYPES } from '@constants/types'
import { Tag } from '@entities/tag'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject, injectable } from 'inversify'
import { DataSource } from 'typeorm'

@injectable()
export default class TagRepository extends BaseRepository<Tag> implements ITagRepository {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Tag, dataSource)
  }
}
