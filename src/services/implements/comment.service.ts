import { TYPES } from '@constants/types'
import { inject, injectable } from 'inversify'
import BaseService from '@services/implements/base.service'
import { ICommentService } from '@services/contracts/comment.service.interface'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { DeepPartial, ILike } from 'typeorm'
import { Comment } from '@entities/comment'
import { ICommentRepository } from '@repositories/contracts/comment.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import { BASE_STATUS } from '@constants/base.status'
import { CommentResource } from '@mappers/comment.mapper'

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
  ): Promise<IPaginationResult<Comment>> {
    const { page = 1, limit = 10 } = options

    const post = await this.postRepository.findById(postId)
    if (!post || post.status !== BASE_STATUS.PUBLISHED) {
      throw new BadRequestException(`Not found post ${postId}`)
    }

    const [items, totalItems] = await this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post = :postId', { postId })
      .orderBy('comment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      items: CommentResource.collection(items) as Comment[],
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    }
  }

  async store(userId: string | number, data: DeepPartial<Comment>): Promise<Comment> {
    const { id } = data

    const [user, post] = await Promise.all([
      this.userRepository.findById(userId),
      this.postRepository.findById(id!)
    ])

    if (!post || post.status !== BASE_STATUS.PUBLISHED) {
      throw new BadRequestException(`Not found post ${id}`)
    }

    if (!user) {
      throw new BadRequestException(`Not found user ${userId}`)
    }

    const comment = this.create({ ...data, user, post })
    return await this.save(comment)
  }

  async paginate(options: IQueryOptions<Comment>): Promise<IPaginationResult<Comment>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', orderBy = 'DESC' } = options

    const allowedSortFields: (keyof Comment)[] = ['id', 'status', 'createdAt', 'updatedAt']
    const sortField = allowedSortFields.includes(sortBy as keyof Comment) ? sortBy : 'createdAt'

    const findOptions: IQueryOptions<Comment> = {
      page,
      limit,
      sortBy: sortField as keyof Comment,
      orderBy,
      where: search ? { content: ILike(`%${search}%`) } : undefined,
      relations: ['user', 'post']
    }

    return super.paginate(findOptions)
  }
}
