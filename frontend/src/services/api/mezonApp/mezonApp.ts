import {
  MezonAppControllerListAdminMezonAppApiResponse,
  MezonAppControllerGetMezonAppApiArg,
  MezonAppControllerGetMyAppApiResponse,
  MezonAppControllerGetMezonAppDetailApiResponse,
  MezonAppControllerDeleteMezonAppApiResponse,
  MezonAppControllerDeleteMezonAppApiArg,
  MezonAppControllerCreateMezonAppApiArg,
  MezonAppControllerUpdateMezonAppApiArg,
  MezonAppControllerGetRelatedMezonAppApiResponse,
  MezonAppControllerSearchMezonAppApiResponse,
  MezonAppControllerSearchMezonAppApiArg
} from './mezonApp.types'
import { api } from '../../apiInstance'
import { App } from '@app/types/App.types'
import { RequestWithId } from '@app/types/API.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mezonAppControllerListAdminMezonApp: build.query<
      MezonAppControllerListAdminMezonAppApiResponse,
      MezonAppControllerGetMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/admin-all`,
        params: {
          search: queryArg.search,
          tags: queryArg.tags,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    mezonAppControllerGetMyApp: build.query<MezonAppControllerGetMyAppApiResponse, MezonAppControllerGetMezonAppApiArg>({
      query: (queryArg) => ({
        url: `/api/mezon-app/my-app`,
        params: {
          search: queryArg.search,
          tags: queryArg.tags,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    mezonAppControllerGetMezonAppDetail: build.query<
      MezonAppControllerGetMezonAppDetailApiResponse,
      RequestWithId
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
      App,
      MezonAppControllerCreateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'POST', body: queryArg.createMezonAppRequest })
    }),
    mezonAppControllerUpdateMezonApp: build.mutation<
      App,
      MezonAppControllerUpdateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'PUT', body: queryArg.updateMezonAppRequest })
    }),
    mezonAppControllerGetRelatedMezonApp: build.query<
      MezonAppControllerGetRelatedMezonAppApiResponse,
      RequestWithId
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
        params: {
          ownerId: queryArg.ownerId,
          search: queryArg.search,
          tags: queryArg.tags,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as mezonAppService }

export const {
  useMezonAppControllerListAdminMezonAppQuery,
  useLazyMezonAppControllerListAdminMezonAppQuery,
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
