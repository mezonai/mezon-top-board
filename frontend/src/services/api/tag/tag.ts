import { api } from '../../apiInstance'
import type {
  TagControllerGetTagsApiResponse,
  TagControllerGetTagsApiArg,
  TagControllerSearchTagsApiResponse,
  TagControllerSearchTagsApiArg,
  TagControllerCreateTagApiResponse,
  TagControllerCreateTagApiArg,
  TagControllerUpdateTagApiResponse,
  TagControllerUpdateTagApiArg,
  TagControllerDeleteTagApiResponse,
  TagControllerDeleteTagApiArg
} from './tag.types'

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

export const {
  useTagControllerGetTagsQuery,
  useLazyTagControllerGetTagsQuery,
  useTagControllerSearchTagsQuery,
  useLazyTagControllerSearchTagsQuery,
  useTagControllerCreateTagMutation,
  useTagControllerUpdateTagMutation,
  useTagControllerDeleteTagMutation
} = injectedRtkApi