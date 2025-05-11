import HttpException from '@exceptions/http.exception'
import { FORBIDDEN } from '@utils/http.status.code'

export default class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized Exception', status = FORBIDDEN) {
    super(message, status)
    this.name = 'UnauthorizedException'
  }
}
