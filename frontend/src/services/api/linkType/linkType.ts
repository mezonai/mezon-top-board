import { api } from '../../apiInstance'
import type {
  LinkTypeControllerGetAllLinksApiResponse,
  LinkTypeControllerGetAllLinksApiArg,
  LinkTypeControllerCreateLinkTypeApiResponse,
  LinkTypeControllerCreateLinkTypeApiArg,
  LinkTypeControllerUpdateLinkTypeApiResponse,
  LinkTypeControllerUpdateLinkTypeApiArg,
  LinkTypeControllerDeleteLinkTypeApiResponse,
  LinkTypeControllerDeleteLinkTypeApiArg
} from './linkType.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    linkTypeControllerGetAllLinks: build.query<
      LinkTypeControllerGetAllLinksApiResponse,
      LinkTypeControllerGetAllLinksApiArg
    >({
      query: () => ({ url: `/api/link-type` })
    }),
    linkTypeControllerCreateLinkType: build.mutation<
      LinkTypeControllerCreateLinkTypeApiResponse,
      LinkTypeControllerCreateLinkTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/link-type`,
        method: 'POST',
        body: queryArg.createLinkTypeRequest
      })
    }),
    linkTypeControllerUpdateLinkType: build.mutation<
      LinkTypeControllerUpdateLinkTypeApiResponse,
      LinkTypeControllerUpdateLinkTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/link-type`,
        method: 'PUT',
        body: queryArg.updateLinkTypeRequest
      })
    }),
    linkTypeControllerDeleteLinkType: build.mutation<
      LinkTypeControllerDeleteLinkTypeApiResponse,
      LinkTypeControllerDeleteLinkTypeApiArg
    >({
      query: (queryArg) => ({ url: `/api/link-type`, method: 'DELETE', body: queryArg.requestWithId })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as linkTypeService }


export const {
  useLinkTypeControllerGetAllLinksQuery,
  useLazyLinkTypeControllerGetAllLinksQuery,
  useLinkTypeControllerCreateLinkTypeMutation,
  useLinkTypeControllerDeleteLinkTypeMutation,
  useLinkTypeControllerUpdateLinkTypeMutation
} = injectedRtkApi
