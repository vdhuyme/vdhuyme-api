import { TYPES } from '@constants/types'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import CategoryRepository from '@repositories/implements/category.repository'
import PostRepository from '@repositories/implements/post.repository'
import TagRepository from '@repositories/implements/tag.repository'
import UserRepository from '@repositories/implements/user.repository'
import { IAuthService } from '@services/contracts/auth.service.interface'
import { ICategoryService } from '@services/contracts/category.service.interface'
import { IImagekitService } from '@services/contracts/imagekit.service.interface'
import { IPostService } from '@services/contracts/post.service.interface'
import { IStatsService } from '@services/contracts/stats.service.interface'
import { ITagService } from '@services/contracts/tag.service.interface'
import AuthService from '@services/implements/auth.service'
import CategoryService from '@services/implements/category.service'
import ImagekitService from '@services/implements/imagekit.service'
import PostService from '@services/implements/post.service'
import StatsService from '@services/implements/stats.service'
import TagService from '@services/implements/tag.service'
import { dataSource } from 'data-source'
import { Container } from 'inversify'

const container = new Container()

container.bind(TYPES.DataSource).toConstantValue(dataSource)

// Repositories
container
  .bind<ICategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepository)
  .inSingletonScope()
container.bind<ITagRepository>(TYPES.TagRepository).to(TagRepository).inSingletonScope()
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<IPostRepository>(TYPES.PostRepository).to(PostRepository).inSingletonScope()

// Services
container.bind<ITagService>(TYPES.TagService).to(TagService).inSingletonScope()
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind<IImagekitService>(TYPES.ImagekitService).to(ImagekitService).inSingletonScope()
container.bind<IStatsService>(TYPES.StatsService).to(StatsService).inSingletonScope()
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService).inSingletonScope()
container.bind<IPostService>(TYPES.PostService).to(PostService).inSingletonScope()

export { container }
