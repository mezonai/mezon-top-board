import { api } from '../../apiInstance'
import { HttpResponse } from '@app/types/API.types'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    authControllerVerifyOAuth2: build.mutation<AuthControllerVerifyOAuth2ApiResponse, AuthControllerVerifyOAuth2ApiArg>(
      {
        query: (queryArg) => ({ url: `/api/auth/verify-oauth2`, method: 'POST', body: queryArg.oAuth2Request })
      }
    )
  }),
  overrideExisting: false
})
export { injectedRtkApi as authService }
export type AuthControllerVerifyOAuth2ApiResponse = HttpResponse<{
  accessToken: string
  refreshToken: string
  isFirstLogin: boolean
}>
export type AuthControllerVerifyOAuth2ApiArg = {
  oAuth2Request: OAuth2Request
}
export type OAuth2Request = {
  code: string
  scope?: string | string[] | undefined | null
  state?: string
}
export const { useAuthControllerVerifyOAuth2Mutation } = injectedRtkApi
