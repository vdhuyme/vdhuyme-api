import { Container } from 'inversify'
import { IPostRepository } from 'interfaces'
import PostRepository from '@repositories/post.repository'
import PostService from '@services/post.service'
import AuthService from '@services/auth.service'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import UserRepository from '@repositories/user.repository'

const container = new Container()

// Register repositories
container.bind<IPostRepository>('IPostRepository').to(PostRepository).inSingletonScope()
container.bind<IUserRepository>('IUserRepository').to(UserRepository).inSingletonScope()

// Register services
container.bind<PostService>('PostService').to(PostService).inSingletonScope()
container.bind<AuthService>('AuthService').to(AuthService).inSingletonScope()

export { container }
