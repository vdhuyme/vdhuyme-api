import { Comment } from '@entities/comment'
import { CommentsWithTotal } from '@interfaces/contracts/comment.contract'
import { ICommentRepository } from '@interfaces/repositories/comment.repository.interface'
import QueryFilterCommentRequest from '@requests/query.filter.comment.request'
import { ds } from 'data-source'
import { Repository } from 'typeorm'

export default class CommentRepository implements ICommentRepository {
  repository: Repository<Comment>

  constructor() {
    this.repository = ds.getRepository<Comment>(Comment)
  }

  private getCommentsBuilder(options: QueryFilterCommentRequest) {
    const { page = 1, limit = 10, sort = 'DESC' } = options
    const skip = (page - 1) * limit

    return (
      this.repository
        .createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .addSelect(['user.id', 'user.name', 'user.avatar', 'user.phoneNumber', 'user.email'])
        .leftJoin('comment.post', 'post')
        // .orderBy('comment.createdAt', sort)
        .skip(skip)
        .take(limit)
    )
  }

  async getCommentsByPostSlug(
    postSlug: string,
    options: QueryFilterCommentRequest
  ): Promise<CommentsWithTotal> {
    const queryBuilder = this.getCommentsBuilder(options)
    queryBuilder.andWhere('post.slug = :slug', { slug: postSlug })

    const [comments, total] = await queryBuilder.getManyAndCount()
    return { comments, total }
  }

  async getComments(options: QueryFilterCommentRequest): Promise<CommentsWithTotal> {
    const queryBuilder = this.getCommentsBuilder(options)

    if (options.userId !== undefined) {
      queryBuilder.andWhere('comment.userId = :userId', { userId: options.userId })
    }

    const [comments, total] = await queryBuilder.getManyAndCount()
    return { comments, total }
  }

  async getCommentById(id: number): Promise<Comment | null> {
    return this.repository.findOne({ where: { id } })
  }

  async createComment(data: Partial<Comment>): Promise<void> {
    const comment = this.repository.create(data)
    await this.repository.save(comment)
  }

  async updateComment(data: Partial<Comment>): Promise<void> {
    await this.repository.save(data)
  }

  async deleteComment(id: number): Promise<void> {
    await this.repository.delete({ id })
  }
}
