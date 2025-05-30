import { HttpResponse } from '@app/types/API.types'

export type AuthControllerVerifyOAuth2ApiArg = {
  oAuth2Request: OAuth2Request
}

export type AuthControllerVerifyOAuth2ApiResponse = HttpResponse<{
  accessToken: string
  refreshToken: string
}>

export type OAuth2Request = {
  code: string
  scope?: string | string[] | undefined | null
  state?: string
}
