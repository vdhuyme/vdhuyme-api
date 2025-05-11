import HttpException from '@exceptions/http.exception'
import { NOT_FOUND } from '@utils/http.status.code'

export default class NotFoundException extends HttpException {
  constructor(message = 'NotFound Exception', status = NOT_FOUND) {
    super(message, status)
    this.name = 'NotFoundException'
  }
}
