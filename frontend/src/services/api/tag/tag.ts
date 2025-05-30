import { api } from '../../apiInstance'
import {
  TagControllerGetTagsApiArg,
  TagListApiResponse,
  TagControllerSearchTagsApiArg,
  TagControllerCreateTagApiArg,
  TagControllerMutateTagApiResponse,
  TagControllerUpdateTagApiArg,
  TagControllerDeleteTagApiArg,
  TagControllerDeleteTagApiResponse
} from './tag.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    tagControllerGetTags: build.query<TagListApiResponse, TagControllerGetTagsApiArg>({
      query: () => ({ url: `/api/tag` })
    }),
    tagControllerSearchTags: build.query<TagListApiResponse, TagControllerSearchTagsApiArg>({
      query: (params) => ({
        url: `/api/tag/search`,
        method: 'GET',
        params,
      }),
    }),
    tagControllerCreateTag: build.mutation<TagControllerMutateTagApiResponse, TagControllerCreateTagApiArg>({
      query: (queryArg) => ({
        url: `/api/tag`,
        method: 'POST',
        body: queryArg.createTagRequest,
      }),
    }),
    tagControllerUpdateTag: build.mutation<TagControllerMutateTagApiResponse, TagControllerUpdateTagApiArg>({
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
