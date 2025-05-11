import HttpException from '@exceptions/http.exception'
import { BAD_REQUEST } from '@utils/http.status.code'

export default class BadRequestException extends HttpException {
  constructor(message = 'BadRequest Exception', status = BAD_REQUEST) {
    super(message, status)
    this.name = 'BadRequestException'
  }
}
