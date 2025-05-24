import { OAuth2Client } from 'google-auth-library'
import { config } from '@config/app'

export const googleOAuth2Client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
)
