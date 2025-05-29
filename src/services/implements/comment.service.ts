import { TYPES } from '@constants/types'
import { inject, injectable } from 'inversify'
import BaseService from '@services/implements/base.service'
import { ICommentService } from '@services/contracts/comment.service.interface'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { DeepPartial, FindOptionsWhere, ILike } from 'typeorm'
import { Comment } from '@entities/comment'
import { ICommentRepository } from '@repositories/contracts/comment.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import { BASE_STATUS } from '@constants/base.status'
import { CommentResource, ICommentResponse } from '@mappers/comment.mapper'

@injectable()
export default class CommentService extends BaseService<Comment> implements ICommentService {
  private readonly userRepository: IUserRepository
  private readonly postRepository: IPostRepository

  constructor(
    @inject(TYPES.CommentRepository) commentRepository: ICommentRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.PostRepository) postRepository: IPostRepository
  ) {
    super(commentRepository)
    this.userRepository = userRepository
    this.postRepository = postRepository
  }

  async getCommentsByPost(
    postId: string | number,
    options: IQueryOptions<Comment>
  ): Promise<ICommentResponse[]> {
    const { page = 1, limit = 10 } = options

    const post = await this.postRepository.findById(postId)
    if (!post || post.status !== BASE_STATUS.PUBLISHED) {
      throw new BadRequestException(`Not found post ${postId}`)
    }

    const queryBuilder = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post = :postId', { postId })
      .orderBy('comment.createdAt', 'DESC')

    const skip = (page - 1) * limit
    queryBuilder.skip(skip).take(limit)
    const comments = await queryBuilder.getMany()

    return CommentResource.collection(comments)
  }

  async store(userId: string | number, data: DeepPartial<Comment>): Promise<Comment> {
    const { id } = data

    const post = await this.postRepository.findById(id!)
    if (!post || post.status !== BASE_STATUS.PUBLISHED) {
      throw new BadRequestException(`Not found post ${id}`)
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new BadRequestException(`Not found user ${userId}`)
    }

    const comment = this.create({ ...data, user, post })
    return await this.save(comment)
  }

  async findWithPagination(options: IQueryOptions<Comment>): Promise<IPaginationResult<Comment>> {
    const { search, sort, ...rest } = options

    const where: FindOptionsWhere<Comment> | FindOptionsWhere<Comment>[] | undefined = search
      ? { content: ILike(`%${search}%`) }
      : (rest.where ?? {})

    const allowedSortFields: (keyof Comment)[] = ['id', 'status', 'createdAt', 'updatedAt']
    const order = this.buildOrder(sort, allowedSortFields)

    return super.findWithPagination({ ...rest, where, order })
  }
}
