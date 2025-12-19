import { api } from '../../apiInstance';
import type {
  TempFilesDownloadApiResponse,
  TempFilesDownloadApiArg,
  TempStorageControllerSearchTempFilesApiResponse,
  TempStorageControllerSearchTempFileshApiArg,
  TempStorageControllerGetMyTempFilesApiResponse,
  TempStorageControllerGetMyTempFilesApiArg,
  TempStorageControllerGetTempFileApiResponse,
  TempStorageControllerGetTempFileApiArg
} from './tempStorage.types';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    tempStorageControllerSearchTempFiles: build.query<
      TempStorageControllerSearchTempFilesApiResponse,
      TempStorageControllerSearchTempFileshApiArg
    >({
      query: (params) => ({
        url: `/api/temp-storage/search`,
        method: 'GET',
        params
      })
    }),
    tempStorageControllerGetMyTempFiles: build.query<
      TempStorageControllerGetMyTempFilesApiResponse,
      TempStorageControllerGetMyTempFilesApiArg
    >({
      query: (params) => ({
        url: `/api/temp-storage/my-files`,
        method: 'GET',
        params
      })
    }),
    tempStorageControllerGetTempFile: build.query<
      TempStorageControllerGetTempFileApiResponse,
      TempStorageControllerGetTempFileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/temp-storage/${queryArg.id}`,
        method: 'GET'
      })
    }),

    tempFilesDownload: build.query<
      TempFilesDownloadApiResponse,
      TempFilesDownloadApiArg
    >({
      query: (queryArg) => ({
        url: `/api/temp-files/${queryArg.filePath}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      })
    }),
  }),
  overrideExisting: false
});

export { injectedRtkApi as tempStorageService };

export const {
  useTempStorageControllerSearchTempFilesQuery,
  useLazyTempStorageControllerSearchTempFilesQuery,
  useTempStorageControllerGetMyTempFilesQuery,
  useLazyTempStorageControllerGetMyTempFilesQuery,
  useTempStorageControllerGetTempFileQuery,
  useLazyTempStorageControllerGetTempFileQuery,
  useTempFilesDownloadQuery,
  useLazyTempFilesDownloadQuery
} = injectedRtkApi;