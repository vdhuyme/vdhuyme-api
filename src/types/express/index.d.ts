import { IJwtAuthUserPayload } from '../../interfaces/index'

declare global {
  namespace Express {
    interface Request {
      auth: IJwtAuthUserPayload
    }
  }
}

export {}
