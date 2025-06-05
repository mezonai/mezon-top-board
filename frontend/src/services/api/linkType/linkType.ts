import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { RequestWithId } from '../mezonApp/mezonApp'
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
export type LinkTypeControllerGetAllLinksApiResponse = HttpResponse<LinkTypeResponse[]>
export type LinkTypeControllerGetAllLinksApiArg = void
export type LinkTypeResponse = {
  id: string
  name: string
  icon: string
  prefixUrl: string
}
export type LinkTypeControllerUpdateLinkTypeApiResponse = HttpResponse<LinkTypeResponse>
export type LinkTypeControllerUpdateLinkTypeApiArg = {
  updateLinkTypeRequest: UpdateLinkTypeRequest
}

export type LinkTypeControllerCreateLinkTypeApiResponse = HttpResponse<LinkTypeResponse>
export type LinkTypeControllerCreateLinkTypeApiArg = {
  createLinkTypeRequest: CreateLinkTypeRequest
}

export type LinkTypeControllerDeleteLinkTypeApiResponse = HttpResponse<LinkTypeResponse>
export type LinkTypeControllerDeleteLinkTypeApiArg = {
  requestWithId: RequestWithId
}

export type UpdateLinkTypeRequest = {
  id: string
  name?: string
  icon?: string
  prefixUrl?: string
}

export type CreateLinkTypeRequest = {
  name: string
  icon: string
  prefixUrl: string
}

export const {
  useLinkTypeControllerGetAllLinksQuery,
  useLazyLinkTypeControllerGetAllLinksQuery,
  useLinkTypeControllerCreateLinkTypeMutation,
  useLinkTypeControllerDeleteLinkTypeMutation,
  useLinkTypeControllerUpdateLinkTypeMutation
} = injectedRtkApi
