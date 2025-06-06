import { api } from '../../apiInstance'
import {
  LinkTypeControllerGetAllLinksApiResponse,
  LinkTypeControllerGetAllLinksApiArg,
  LinkTypeMutationResponse,
  LinkTypeControllerCreateLinkTypeApiArg,
  LinkTypeControllerUpdateLinkTypeApiArg,
  LinkTypeControllerDeleteLinkTypeApiArg,
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
      LinkTypeMutationResponse,
      LinkTypeControllerCreateLinkTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/link-type`,
        method: 'POST',
        body: queryArg.createLinkTypeRequest
      })
    }),
    linkTypeControllerUpdateLinkType: build.mutation<
      LinkTypeMutationResponse,
      LinkTypeControllerUpdateLinkTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/link-type`,
        method: 'PUT',
        body: queryArg.updateLinkTypeRequest
      })
    }),
    linkTypeControllerDeleteLinkType: build.mutation<
      LinkTypeMutationResponse,
      LinkTypeControllerDeleteLinkTypeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/link-type`,
        method: 'DELETE',
        body: queryArg.requestWithId
      })
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
