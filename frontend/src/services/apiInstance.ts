import { getAccessTokens, getRefreshTokens, removeAccessTokens, storeAccessTokens } from '@app/utils/storage'
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import axios from 'axios'

const paramsSerializer = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key]

    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(`${key}[]`, item));
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}

const getBaseQuery = (
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async function (args, api, extraOptions) {
    let result = await baseQuery(args, api, extraOptions)
    if (
      result.error &&
      (result.error.status === 401 ||
        (result.error.data as { message?: string; error?: string })?.error === 'Unauthorized')
    ) {
      try {
        const refreshToken = getRefreshTokens()
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/refresh-token`, {
          refreshToken
        })
        storeAccessTokens(response?.data?.data)

        const updatedArgs =
          typeof args === 'object'
            ? {
              ...args,
              headers: { ...(args.headers || {}), Authorization: `Bearer ${response.data.data.accessToken}` }
            }
            : args

        return await baseQuery(updatedArgs, api, extraOptions)
      } catch (err) {
        removeAccessTokens()
        return result
      }
    }
    return result
  }
}

export const api = createApi({
  baseQuery: getBaseQuery(
    fetchBaseQuery({
      baseUrl: process.env.REACT_APP_BACKEND_URL,
      prepareHeaders: async (headers) => {
        const token = getAccessTokens()
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
      },
      paramsSerializer
    })
  ),
  tagTypes: ['Collections'],
  endpoints: () => ({})
})
