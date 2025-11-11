import { api } from '../../apiInstance'
import type { AuthControllerVerifyOAuth2ApiResponse, AuthControllerVerifyOAuth2ApiArg } from './auth.types'

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
export const { useAuthControllerVerifyOAuth2Mutation } = injectedRtkApi
