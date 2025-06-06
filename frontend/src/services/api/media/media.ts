import { PaginationParams, RequestWithId } from '@app/types/API.types'
import { api } from '../../apiInstance'
import {
  MediaControllerGetAllMediaApiResponse,
  MediaControllerGetMediaApiResponse,
  MediaControllerCreateMediaApiResponse,
  MediaControllerDeleteMediaApiResponse,
  MediaControllerDeleteMediaApiArg
} from './media.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mediaControllerGetAllMedia: build.query<MediaControllerGetAllMediaApiResponse, PaginationParams>({
      query: (queryArg) => ({
        url: `/api/media/search`,
        params: {
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    mediaControllerGetMedia: build.query<MediaControllerGetMediaApiResponse, RequestWithId>({
      query: (queryArg) => ({
        url: `/api/media`,
        params: {
          id: queryArg.id
        }
      })
    }),
    mediaControllerCreateMedia: build.mutation<MediaControllerCreateMediaApiResponse, FormData>({
      query: (queryArg) => ({ url: `/api/media`, method: 'POST', body: queryArg })
    }),
    mediaControllerDeleteMedia: build.mutation<MediaControllerDeleteMediaApiResponse, MediaControllerDeleteMediaApiArg>(
      {
        query: (queryArg) => ({ url: `/api/media`, method: 'DELETE', body: queryArg.deleteMediaRequest })
      }
    )
  }),
  overrideExisting: false
})
export { injectedRtkApi as mediaService }

export const {
  useMediaControllerGetAllMediaQuery,
  useLazyMediaControllerGetAllMediaQuery,
  useMediaControllerGetMediaQuery,
  useLazyMediaControllerGetMediaQuery,
  useMediaControllerCreateMediaMutation,
  useMediaControllerDeleteMediaMutation
} = injectedRtkApi
