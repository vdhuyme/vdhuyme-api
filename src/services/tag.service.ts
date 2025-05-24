import BadRequestException from '@exceptions/bad.request.exception'
import { TagsWithTotal } from '@interfaces/contracts/tag.contract'
import { ITagRepository } from '@interfaces/repositories/tag.repository.interface'
import { ITagService } from '@interfaces/services/tag.service.interface'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { inject } from 'inversify'

export default class TagService implements ITagService {
  constructor(@inject('ITagRepository') private tagRepository: ITagRepository) {}

  async createTag(data: CreateTagRequest): Promise<void> {
    return this.tagRepository.createTag(data)
  }

  async getTags(options: QueryFilterRequest): Promise<TagsWithTotal> {
    return this.tagRepository.getTags(options)
  }

  async updateTag(slug: string, data: UpdateTagRequest): Promise<void> {
    return this.tagRepository.updateTag(slug, data)
  }

  async deleteTag(slug: string): Promise<void> {
    const tag = await this.tagRepository.getTag(slug)
    if (!tag) {
      throw new BadRequestException(`Tag with slug ${slug} not found`)
    }

    await this.tagRepository.deleteTag(slug)
  }
}
