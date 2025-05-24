import { Tag } from '@entities/tag'

export interface TagsWithTotal {
  tags: Tag[] | []
  total: number | 0
}
