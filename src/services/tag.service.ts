import { Tag } from '@entities/tag'
import BadRequestException from '@exceptions/bad.request.exception'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import { ITagRepository } from '@interfaces/repositories/tag.repository.interface'
import { ITagService } from '@interfaces/services/tag.service.interface'
import QueryFilterRequest from '@requests/query.filter.request'
import { inject } from 'inversify'

export default class TagService implements ITagService {
  constructor(@inject('ITagRepository') private tagRepository: ITagRepository) {}

  async createTag(data: Partial<Tag>): Promise<void> {
    return this.tagRepository.createTag(data)
  }

  async getTags(options: QueryFilterRequest): Promise<TagsWithTotal> {
    return this.tagRepository.getTags(options)
  }

  async updateTag(slug: string, data: Partial<Tag>): Promise<void> {
    const tag = await this.tagRepository.getTag(slug)
    if (!tag) {
      throw new BadRequestException(`Tag with slug ${slug} not found`)
    }

    return this.tagRepository.updateTag(data)
  }

  async deleteTag(slug: string): Promise<void> {
    const tag = await this.tagRepository.getTag(slug)
    if (!tag) {
      throw new BadRequestException(`Tag with slug ${slug} not found`)
    }

    await this.tagRepository.deleteTag(slug)
  }
}
