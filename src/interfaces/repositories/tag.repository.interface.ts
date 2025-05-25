import { Tag } from '@entities/tag'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import QueryFilterRequest from '@requests/query.filter.request'

export interface ITagRepository {
  findById(id: number): Promise<Tag | null>
  findManyByIds(ids: number[]): Promise<Tag[]>
  createTag(data: Partial<Tag>): Promise<void>
  getTag(slug: string): Promise<Tag | null>
  getTags(options: QueryFilterRequest): Promise<TagsWithTotal>
  updateTag(data: Partial<Tag>): Promise<void>
  deleteTag(slug: string): Promise<void>
}
