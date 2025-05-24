import { Container } from 'inversify'
import { IPostRepository, IPostService } from 'interfaces'
import PostRepository from '@repositories/post.repository'
import PostService from '@services/post.service'
import AuthService from '@services/auth.service'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import UserRepository from '@repositories/user.repository'
import { ICategoryRepository } from '@interfaces/repositories/category.repository.interface'
import CategoryRepository from '@repositories/category.repository'
import { ICategoryService } from '@interfaces/services/category.service.interface'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import CategoryService from '@services/category.service'

const container = new Container()

// Register repositories
container.bind<ICategoryRepository>('ICategoryRepository').to(CategoryRepository).inSingletonScope()
container.bind<IPostRepository>('IPostRepository').to(PostRepository).inSingletonScope()
container.bind<IUserRepository>('IUserRepository').to(UserRepository).inSingletonScope()

// Register services
container.bind<ICategoryService>('ICategoryService').to(CategoryService).inSingletonScope()
container.bind<IPostService>('IPostService').to(PostService).inSingletonScope()
container.bind<IAuthService>('IAuthService').to(AuthService).inSingletonScope()

export { container }
