import { Tag } from '@entities/tag'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'

export interface ITagRepository {
  createTag(data: CreateTagRequest): Promise<void>
  getTag(slug: string): Promise<Tag | null>
  getTags(options: QueryFilterRequest): Promise<TagsWithTotal>
  updateTag(slug: string, data: UpdateTagRequest): Promise<void>
  deleteTag(slug: string): Promise<void>
}
