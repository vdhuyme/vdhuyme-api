import HttpException from '@exceptions/http.exception'
import { INTERNAL_SERVER_ERROR } from '@utils/http.status.code'

export default class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error Exception', status = INTERNAL_SERVER_ERROR) {
    super(message, status)
    this.name = 'InternalServerErrorException'
  }
}
