import HttpException from '@exceptions/http.exception'
import { NOT_FOUND } from '@constants/http.status.code'

export default class NotFoundException extends HttpException {
  constructor(message = 'Not Found Exception', status = NOT_FOUND) {
    super(message, status)
    this.name = 'NotFoundException'
  }
}
