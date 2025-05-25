import { Tag } from '@entities/tag'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import QueryFilterRequest from '@requests/query.filter.request'

export interface ITagService {
  createTag(data: Partial<Tag>): Promise<void>
  getTags(options: QueryFilterRequest): Promise<TagsWithTotal>
  updateTag(slug: string, data: Partial<Tag>): Promise<void>
  deleteTag(slug: string): Promise<void>
}
