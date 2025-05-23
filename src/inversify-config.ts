import { Container } from 'inversify'
import { IPostRepository } from 'interfaces'
import PostRepository from '@repositories/post.repository'
import PostService from '@services/post.service'

const container = new Container()

container.bind<IPostRepository>('IPostRepository').to(PostRepository).inSingletonScope()
container.bind<PostService>('PostService').to(PostService).inSingletonScope()

export { container }
