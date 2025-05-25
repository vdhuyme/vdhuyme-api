import BadRequestException from '@exceptions/bad.request.exception'
import { CommentsWithTotal } from '@interfaces/contracts/comment.contract'
import { IPostRepository } from '@interfaces/index'
import { ICommentRepository } from '@interfaces/repositories/comment.repository.interface'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import { ICommentService } from '@interfaces/services/comment.service.interface'
import CreateCommentRequest from '@requests/create.comment.request'
import QueryFilterCommentRequest from '@requests/query.filter.comment.request'
import UpdateCommentRequest from '@requests/update.comment.request'
import { inject } from 'inversify'

export default class CommentService implements ICommentService {
  constructor(
    @inject('ICommentRepository') private commentRepository: ICommentRepository,
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async getComments(options: QueryFilterCommentRequest): Promise<CommentsWithTotal> {
    return await this.commentRepository.getComments(options)
  }

  async getCommentsByPostSlug(
    postSlug: string,
    options: QueryFilterCommentRequest
  ): Promise<CommentsWithTotal> {
    const post = await this.postRepository.getPublishedPost(postSlug)
    if (!post) {
      throw new BadRequestException(`Post with slug ${postSlug} not found or unpublished.`)
    }

    return await this.commentRepository.getCommentsByPostSlug(postSlug, options)
  }

  async createComment(data: CreateCommentRequest, userId: number): Promise<void> {
    const { postSlug } = data
    const post = await this.postRepository.getPublishedPost(postSlug)
    if (!post) {
      throw new BadRequestException(`Post with slug ${postSlug} not found or unpublished.`)
    }
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new BadRequestException(`Not found user ${userId}`)
    }

    await this.commentRepository.createComment({ ...data, user, post })
  }

  async updateComment(id: number, data: UpdateCommentRequest): Promise<void> {
    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) {
      throw new BadRequestException(`Not found comment ${id}`)
    }

    Object.assign(comment, data)

    await this.commentRepository.updateComment(comment)
  }

  async deleteComment(id: number): Promise<void> {
    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) {
      throw new BadRequestException(`Not found comment ${id}`)
    }

    await this.commentRepository.deleteComment(id)
  }
}
