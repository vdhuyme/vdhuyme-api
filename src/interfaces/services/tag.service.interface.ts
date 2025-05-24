import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'

export interface ITagService {
  createTag(data: CreateTagRequest): Promise<void>
  getTags(options: QueryFilterRequest): Promise<TagsWithTotal>
  updateTag(slug: string, data: UpdateTagRequest): Promise<void>
  deleteTag(slug: string): Promise<void>
}
