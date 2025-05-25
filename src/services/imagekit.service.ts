import { config } from '@config/app'
import { imagekit } from '@config/imagekit'
import { IImagekitAuth } from '@interfaces/imagekit/imagekit.auth'
import { IImagekitService } from '@interfaces/services/imagekit.service.interface'

export default class ImagekitService implements IImagekitService {
  auth(): IImagekitAuth {
    const { token, expire, signature } = imagekit.getAuthenticationParameters()
    return { token, expire, signature, publicKey: config.imagekit.publicKey }
  }
}
