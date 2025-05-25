import { Tag } from '@entities/tag'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import { ITagRepository } from '@interfaces/repositories/tag.repository.interface'
import QueryFilterRequest from '@requests/query.filter.request'
import { ds } from 'data-source'
import { In, Repository } from 'typeorm'

export default class TagRepository implements ITagRepository {
  repository: Repository<Tag>

  constructor() {
    this.repository = ds.getRepository<Tag>(Tag)
  }
  findById(id: number): Promise<Tag | null> {
    return this.repository.findOne({ where: { id } })
  }
  findManyByIds(ids: number[]): Promise<Tag[]> {
    return this.repository.find({ where: { id: In(ids) } })
  }

  async createTag(data: Partial<Tag>): Promise<void> {
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

  async updateTag(data: Partial<Tag>): Promise<void> {
    await this.repository.save(data)
  }

  async deleteTag(slug: string): Promise<void> {
    await this.repository.delete({ slug })
  }
}
