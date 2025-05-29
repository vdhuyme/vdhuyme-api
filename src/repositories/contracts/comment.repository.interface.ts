import { Comment } from '@entities/comment'
import { IBaseRepository } from '@repositories/contracts/base.repository.interface'

export type ICommentRepository = IBaseRepository<Comment>
