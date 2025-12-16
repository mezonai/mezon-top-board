import { api } from '../../apiInstance';
import type {
    TempStorageSearchApiResponse,
    TempStorageSearchApiArg,
    TempStorageMyFilesApiResponse,
    TempStorageMyFilesApiArg,
    TempStorageGetFileApiResponse,
    TempStorageGetFileApiArg,
    TempFilesDownloadApiResponse,
    TempFilesDownloadApiArg
} from './tempStorage.types';

const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        tempStorageSearch: build.query<TempStorageSearchApiResponse, TempStorageSearchApiArg>({
            query: (queryArg) => ({
                url: `/api/temp-storage/search`,
                method: 'GET',
                params: {
                    pageSize: queryArg.pageSize,
                    pageNumber: queryArg.pageNumber,
                    sortField: queryArg.sortField,
                    sortOrder: queryArg.sortOrder,
                    ownerId: queryArg.ownerId
                }
            })
        }),
        tempStorageMyFiles: build.query<TempStorageMyFilesApiResponse, TempStorageMyFilesApiArg>({
            query: (queryArg) => ({
                url: `/api/temp-storage/my-files`,
                method: 'GET',
                params: {
                    pageSize: queryArg.pageSize,
                    pageNumber: queryArg.pageNumber,
                    sortField: queryArg.sortField,
                    sortOrder: queryArg.sortOrder
                }
            })
        }),
        tempStorageGetFile: build.query<TempStorageGetFileApiResponse, TempStorageGetFileApiArg>({
            query: (queryArg) => ({
                url: `/api/temp-storage/${queryArg.id}`,
                method: 'GET'
            })
        }),

        tempFilesDownload: build.query<TempFilesDownloadApiResponse, TempFilesDownloadApiArg>({
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
    useTempStorageSearchQuery,
    useLazyTempStorageSearchQuery,
    useTempStorageMyFilesQuery,
    useLazyTempStorageMyFilesQuery,
    useTempStorageGetFileQuery,
    useLazyTempStorageGetFileQuery,
    useTempFilesDownloadQuery,
    useLazyTempFilesDownloadQuery
} = injectedRtkApi;