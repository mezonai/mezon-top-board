import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    tagControllerGetTags: build.query<TagControllerGetTagsApiResponse, TagControllerGetTagsApiArg>({
      query: () => ({ url: `/api/tag` })
    }),
    tagControllerSearchTags: build.query<TagControllerSearchTagsApiResponse, TagControllerSearchTagsApiArg>({
      query: (params) => ({
        url: `/api/tag/search`,
        method: 'GET',
        params,
      }),
    }),
    tagControllerCreateTag: build.mutation<TagControllerCreateTagApiResponse, TagControllerCreateTagApiArg>({
      query: (queryArg) => ({
        url: `/api/tag`,
        method: 'POST',
        body: queryArg.createTagRequest,
      }),
    }),
    tagControllerUpdateTag: build.mutation<TagControllerUpdateTagApiResponse, TagControllerUpdateTagApiArg>({
      query: (queryArg) => ({
        url: `/api/tag`,
        method: 'PUT',
        body: queryArg.updateTagRequest,
      }),
    }),
    tagControllerDeleteTag: build.mutation<
      TagControllerDeleteTagApiResponse,
      TagControllerDeleteTagApiArg
    >({
      query: (queryArg) => ({ url: `/api/tag`, method: 'DELETE', body: queryArg.requestWithId })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as tagService }
export type TagControllerGetTagsApiResponse = HttpResponse<TagResponse[]>
export type TagControllerGetTagsApiArg = void

export type TagControllerCreateTagApiResponse = HttpResponse<TagResponse>
export type TagControllerCreateTagApiArg = {
  createTagRequest: CreateTagRequest
}

export type TagControllerUpdateTagApiResponse = HttpResponse<TagResponse>
export type TagControllerUpdateTagApiArg = {
  updateTagRequest: UpdateTagRequest
}

export type TagControllerDeleteTagApiResponse = HttpResponse<CreateTagRequest>
export type TagControllerDeleteTagApiArg = {
  requestWithId: RequestWithId
}

export type TagControllerSearchTagsApiResponse = HttpResponse<TagResponse[]>
export type TagControllerSearchTagsApiArg = {
  search?: string
  tags?: string[]
  pageSize: number
  pageNumber: number
  sortField?: string
  sortOrder?: string
}

export type TagResponse = {
  id: string
  name: string
  slug: string
  botCount: number
}

export type CreateTagRequest = {
  name: string
  slug: string
}

export type UpdateTagRequest = {
  id: string
  name?: string
  slug?: string
}

export type RequestWithId = {
  id: string
}

export const {
  useTagControllerGetTagsQuery,
  useLazyTagControllerGetTagsQuery,
  useTagControllerSearchTagsQuery,
  useLazyTagControllerSearchTagsQuery,
  useTagControllerCreateTagMutation,
  useTagControllerUpdateTagMutation,
  useTagControllerDeleteTagMutation
} = injectedRtkApi
