import { Tag } from '@entities/tag'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import { ITagRepository } from '@interfaces/repositories/tag.repository.interface'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { ds } from 'data-source'
import { Repository } from 'typeorm'

export default class TagRepository implements ITagRepository {
  repository: Repository<Tag>

  constructor() {
    this.repository = ds.getRepository<Tag>(Tag)
  }

  async createTag(data: CreateTagRequest): Promise<void> {
    const tag = this.repository.create(data)
    await this.repository.save(tag)
  }

  async getTags(options: QueryFilterRequest): Promise<TagsWithTotal> {
    const { page, limit, query, sort } = options
    const skip = (page - 1) * limit

    const [tags, total] = await this.repository
      .createQueryBuilder('tag')
      .andWhere(query ? 'LOWER(tag.name) LIKE LOWER(:query)' : '1=1', {
        query: `%${query}%`
      })
      .orderBy('tag.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return { tags, total }
  }

  async getTag(slug: string): Promise<Tag | null> {
    return await this.repository.findOne({ where: { slug } })
  }

  async updateTag(slug: string, data: UpdateTagRequest): Promise<void> {
    await this.repository.update({ slug }, data)
  }

  async deleteTag(slug: string): Promise<void> {
    await this.repository.delete({ slug })
  }
}
