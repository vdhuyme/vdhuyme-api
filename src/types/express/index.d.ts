import { IJwtAuthUserPayload } from 'interfaces'

declare global {
  namespace Express {
    interface Request {
      auth: IJwtAuthUserPayload
      validated?: unknown
    }
  }
}

export {}
