import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { Role } from '../mezonApp/mezonApp'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    userControllerSearchUser: build.query<UserControllerSearchUserApiResponse, UserControllerSearchUserApiArg>({
      query: (queryArg) => ({
        url: `/api/user`,
        params: {
          search: queryArg.search,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    userControllerUpdateUser: build.mutation<UserControllerUpdateUserApiResponse, UserControllerUpdateUserApiArg>({
      query: (queryArg) => ({ url: `/api/user`, method: 'PUT', body: queryArg.updateUserRequest })
    }),
    userControllerDeleteUser: build.mutation<UserControllerDeleteUserApiResponse, UserControllerDeleteUserApiArg>({
      query: (queryArg) => ({ url: `/api/user`, method: 'DELETE', body: queryArg.requestWithId })
    }),
    userControllerDeactivateUser: build.mutation<UserControllerDeactivateUserApiResponse, UserControllerDeactivateUserApiArg>({
      query: (queryArg) => ({ url: `/api/user/deactivate`, method: 'DELETE', body: queryArg.requestWithId })
    }),
    userControllerActivateUser: build.mutation<UserControllerActivateUserApiResponse, UserControllerActivateUserApiArg>({
      query: (queryArg) => ({ url: `/api/user/activate`, method: 'POST', body: queryArg.requestWithId })
    }),
    userControllerGetUserDetails: build.query<
      UserControllerGetUserDetailsApiResponse,
      UserControllerGetUserDetailsApiArg
    >({
      query: () => ({ url: `/api/user/me` })
    }),
    userControllerGetPublicProfile: build.query<
      UserControllerGetPublicProfileApiResponse,
      UserControllerGetPublicProfileApiArg
    >({
      query: (queryArg) => ({ url: `/api/user/public`, params: { userId: queryArg.userId } })
    }),
    userControllerSelfUpdateUser: build.mutation<
      UserControllerSelfUpdateUserApiResponse,
      UserControllerSelfUpdateUserApiArg
    >({
      query: (queryArg) => ({ url: `/api/user/self-update`, method: 'PUT', body: queryArg.selfUpdateUserRequest })
    }),
    userControllerSyncMezon: build.mutation<UserControllerSyncMezonApiResponse, unknown>({
      query: () => ({ url: `/api/user/sync-mezon`, method: 'POST' })
    }),
  }),
  overrideExisting: false
})
export { injectedRtkApi as userService }
export type UserControllerSearchUserApiResponse = HttpResponse<SearchUserResponse[]>
export type UserControllerSearchUserApiArg = {
  /** Keyword to search user by name or email */
  search: string
  pageSize: number
  pageNumber: number
  sortField: string
  sortOrder: 'ASC' | 'DESC'
}
export type UserControllerUpdateUserApiResponse = unknown
export type UserControllerUpdateUserApiArg = {
  updateUserRequest: UpdateUserRequest
}
export type UserControllerDeleteUserApiResponse = unknown
export type UserControllerDeleteUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerDeactivateUserApiResponse = unknown
export type UserControllerDeactivateUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerActivateUserApiResponse = unknown
export type UserControllerActivateUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerSyncMezonApiResponse = unknown
export type UserControllerGetUserDetailsApiResponse = HttpResponse<GetUserDetailsResponse>
export type UserControllerGetUserDetailsApiArg = void
export type UserControllerGetPublicProfileApiResponse = HttpResponse<GetPublicProfileResponse>
export type UserControllerGetPublicProfileApiArg = {
  userId: string
}
export type UserControllerSelfUpdateUserApiResponse = unknown
export type UserControllerSelfUpdateUserApiArg = {
  selfUpdateUserRequest: SelfUpdateUserRequest
}
export type SearchUserResponse = {
  id: string
  name: string
  email: string
  bio: string
  role: string
}
export type UpdateUserRequest = {
  id: string
  name?: string
  bio?: string
  role?: Role
}
export type RequestWithId = {
  id: string
}
export type GetUserDetailsResponse = {
  id: string
  name: string
  email: string
  bio: string
  role: Role
  profileImage: string
  deletedAt: Date | null
}
export type GetPublicProfileResponse = {
  id: string
  name: string
  bio: string
  profileImage: string
}
export type SelfUpdateUserRequest = {
  name?: string
  bio?: string
  profileImage?: string
}
export const {
  useUserControllerSearchUserQuery, 
  useLazyUserControllerSearchUserQuery,
  useUserControllerUpdateUserMutation,
  useUserControllerDeleteUserMutation,
  useUserControllerDeactivateUserMutation,
  useUserControllerActivateUserMutation,
  useUserControllerGetUserDetailsQuery,
  useLazyUserControllerGetUserDetailsQuery,
  useUserControllerGetPublicProfileQuery,
  useLazyUserControllerGetPublicProfileQuery,
  useUserControllerSelfUpdateUserMutation,
  useUserControllerSyncMezonMutation,
} = injectedRtkApi
