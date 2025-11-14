import { api } from '../../apiInstance'
import type {
  MezonAppControllerListAdminMezonAppApiResponse,
  MezonAppControllerListAdminMezonAppApiArg,
  MezonAppControllerGetMyAppApiResponse,
  MezonAppControllerGetMyAppApiArg,
  MezonAppControllerGetMezonAppDetailApiResponse,
  MezonAppControllerGetMezonAppDetailApiArg,
  MezonAppControllerDeleteMezonAppApiResponse,
  MezonAppControllerDeleteMezonAppApiArg,
  MezonAppControllerCreateMezonAppApiResponse,
  MezonAppControllerCreateMezonAppApiArg,
  MezonAppControllerUpdateMezonAppApiResponse,
  MezonAppControllerUpdateMezonAppApiArg,
  MezonAppControllerGetRelatedMezonAppApiResponse,
  MezonAppControllerGetRelatedMezonAppApiArg,
  MezonAppControllerSearchMezonAppApiResponse,
  MezonAppControllerSearchMezonAppApiArg,
  MezonAppControllerListAdminHasNewUpdateAppApiResponse,
  MezonAppControllerListAdminHasNewUpdateAppApiArg
} from './mezonApp.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mezonAppControllerListAdminMezonApp: build.query<
      MezonAppControllerListAdminMezonAppApiResponse,
      MezonAppControllerListAdminMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/admin-all`,
        params: { ...queryArg }
      })
    }),

    mezonAppControllerListAdminHasNewUpdateApp: build.query<
      MezonAppControllerListAdminHasNewUpdateAppApiResponse,
      MezonAppControllerListAdminHasNewUpdateAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/admin-review`,
        params: { ...queryArg }
      })
    }),

    mezonAppControllerGetMyApp: build.query<MezonAppControllerGetMyAppApiResponse, MezonAppControllerGetMyAppApiArg>({
      query: (queryArg) => ({
        url: `/api/mezon-app/my-app`,
        params: { ...queryArg }
      })
    }),
    mezonAppControllerGetMezonAppDetail: build.query<
      MezonAppControllerGetMezonAppDetailApiResponse,
      MezonAppControllerGetMezonAppDetailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app`,
        params: {
          id: queryArg.id
        }
      })
    }),
    mezonAppControllerDeleteMezonApp: build.mutation<
      MezonAppControllerDeleteMezonAppApiResponse,
      MezonAppControllerDeleteMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'DELETE', body: queryArg.requestWithId }),
    }),
    mezonAppControllerCreateMezonApp: build.mutation<
      MezonAppControllerCreateMezonAppApiResponse,
      MezonAppControllerCreateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'POST', body: queryArg.createMezonAppRequest })
    }),
    mezonAppControllerUpdateMezonApp: build.mutation<
      MezonAppControllerUpdateMezonAppApiResponse,
      MezonAppControllerUpdateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'PUT', body: queryArg.updateMezonAppRequest })
    }),
    mezonAppControllerGetRelatedMezonApp: build.query<
      MezonAppControllerGetRelatedMezonAppApiResponse,
      MezonAppControllerGetRelatedMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/related-app`,
        params: {
          id: queryArg.id
        }
      })
    }),
    mezonAppControllerSearchMezonApp: build.query<
      MezonAppControllerSearchMezonAppApiResponse,
      MezonAppControllerSearchMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/search`,
        params: { ...queryArg }
      })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as mezonAppService }

export const {
  useMezonAppControllerListAdminMezonAppQuery,
  useLazyMezonAppControllerListAdminMezonAppQuery,
  useMezonAppControllerListAdminHasNewUpdateAppQuery,
  useLazyMezonAppControllerListAdminHasNewUpdateAppQuery,
  useMezonAppControllerGetMyAppQuery,
  useLazyMezonAppControllerGetMyAppQuery,
  useMezonAppControllerGetMezonAppDetailQuery,
  useLazyMezonAppControllerGetMezonAppDetailQuery,
  useMezonAppControllerDeleteMezonAppMutation,
  useMezonAppControllerCreateMezonAppMutation,
  useMezonAppControllerUpdateMezonAppMutation,
  useMezonAppControllerGetRelatedMezonAppQuery,
  useLazyMezonAppControllerGetRelatedMezonAppQuery,
  useMezonAppControllerSearchMezonAppQuery,
  useLazyMezonAppControllerSearchMezonAppQuery
} = injectedRtkApi