import { config } from '@config/app'
import { imagekit } from '@config/imagekit'
import { IImagekitAuth } from '@interfaces/imagekit/imagekit.auth'
import { IImagekitService } from '@services/contracts/imagekit.service.interface'

export default class ImagekitService implements IImagekitService {
  auth(): IImagekitAuth {
    const authPrams = imagekit.getAuthenticationParameters()
    return Object.assign(authPrams, { publicKey: config.imagekit.publicKey })
  }
}
