import { TempFileControllerGetAllTempFileApiArg, TempFileControllerGetAllTempFileApiResponse, TempFileControllerGetMyTempFileApiArg, TempFileControllerGetMyTempFileApiResponse, TempFileControllerGetTempFileApiArg, TempFileControllerGetTempFileApiResponse } from '@app/services/api/tempStorage/tempStorage.types'
import { api } from '../../apiInstance'


const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    tempStorageGetTempFiles: build.query<
      TempFileControllerGetAllTempFileApiResponse,
      TempFileControllerGetAllTempFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/temp-storage/search`,
        method: 'GET',
        params: queryArg,
      }),
    }),

    tempStorageGetOwnTempFiles: build.query<
      TempFileControllerGetMyTempFileApiResponse,
      TempFileControllerGetMyTempFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/temp-storage/my-files`,
        method: 'GET',
        params: queryArg,
      }),
    }),

    tempStorageGetTempFile: build.query<
      TempFileControllerGetTempFileApiResponse,
      TempFileControllerGetTempFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/temp-storage/${queryArg.id}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
})

export const tempStorageService = injectedRtkApi
export const {
  useTempStorageGetTempFilesQuery,
  useTempStorageGetOwnTempFilesQuery,
  useTempStorageGetTempFileQuery,
} = injectedRtkApi
