import { Post } from '@entities/post'
import { IBaseRepository } from '@repositories/contracts/base.repository.interface'

export type IPostRepository = IBaseRepository<Post>
