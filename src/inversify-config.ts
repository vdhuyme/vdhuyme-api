import { TYPES } from '@constants/types'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import TagRepository from '@repositories/implements/tag.repository'
import { ITagService } from '@services/contracts/tag.service.interface'
import TagService from '@services/implements/tag.service'
import { Container } from 'inversify'

const container = new Container()

// Repositories
container.bind<ITagRepository>(TYPES.TagRepository).to(TagRepository).inSingletonScope()

// Services
container.bind<ITagService>(TYPES.TagService).to(TagService).inSingletonScope()

export { container }
