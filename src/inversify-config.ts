import { TYPES } from '@constants/types'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import TagRepository from '@repositories/implements/tag.repository'
import UserRepository from '@repositories/implements/user.repository'
import { IAuthService } from '@services/contracts/auth.service.interface'
import { IImagekitService } from '@services/contracts/imagekit.service.interface'
import { IStatsService } from '@services/contracts/stats.service.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import AuthService from '@services/implements/auth.service'
import ImagekitService from '@services/implements/imagekit.service'
import StatsService from '@services/implements/stats.service'
import TagService from '@services/implements/tag.service'
import { dataSource } from 'data-source'
import { Container } from 'inversify'

const container = new Container()

container.bind(TYPES.DataSource).toConstantValue(dataSource)

// Repositories
container.bind<ITagRepository>(TYPES.TagRepository).to(TagRepository).inSingletonScope()
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope()

// Services
container.bind<ITagService>(TYPES.TagService).to(TagService).inSingletonScope()
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind<IImagekitService>(TYPES.ImagekitService).to(ImagekitService).inSingletonScope()
container.bind<IStatsService>(TYPES.StatsService).to(StatsService).inSingletonScope()

export { container }
