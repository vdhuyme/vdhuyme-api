import { IImagekitAuth } from '@interfaces/imagekit/imagekit.auth'

export interface IImagekitService {
  auth(): IImagekitAuth
}
