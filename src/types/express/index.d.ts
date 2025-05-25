import { IJwtAuthUserPayload } from 'interfaces'

declare global {
  namespace Express {
    interface Request {
      auth: IJwtAuthUserPayload
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      validated?: unknown
    }
  }
}

export {}
