import { api } from '../../apiInstance'
import type {
  UserControllerSearchUserApiResponse,
  UserControllerSearchUserApiArg,
  UserControllerUpdateUserApiResponse,
  UserControllerUpdateUserApiArg,
  UserControllerDeleteUserApiResponse,
  UserControllerDeleteUserApiArg,
  UserControllerDeactivateUserApiResponse,
  UserControllerDeactivateUserApiArg,
  UserControllerActivateUserApiResponse,
  UserControllerActivateUserApiArg,
  UserControllerGetUserDetailsApiResponse,
  UserControllerGetUserDetailsApiArg,
  UserControllerGetPublicProfileApiResponse,
  UserControllerGetPublicProfileApiArg,
  UserControllerSelfUpdateUserApiResponse,
  UserControllerSelfUpdateUserApiArg,
  UserControllerSyncMezonApiResponse,
  UserControllerSyncMezonApiArg
} from './user.types'

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