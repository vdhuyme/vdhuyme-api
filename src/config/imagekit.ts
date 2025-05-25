import ImageKit from 'imagekit'
import { config } from '@config/app'

export const imagekit = new ImageKit({
  urlEndpoint: config.imagekit.urlEndpoint,
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey
})
