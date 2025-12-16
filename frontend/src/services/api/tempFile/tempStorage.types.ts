import { HttpResponse } from '@app/types/API.types';
import { BaseListApiArg } from '@app/types/common.types';
import { TempFile } from '@app/types/tempFile.types';

export type TempStorageSearchApiArg = BaseListApiArg & {
  ownerId?: string;
};
export type TempStorageSearchApiResponse = HttpResponse<TempFile[]>;

export type TempStorageGetFileApiArg = {
  id: string;
};
export type TempStorageGetFileApiResponse = HttpResponse<TempFile>;

export type TempFilesDownloadApiArg = {
  filePath: string;
};
export type TempFilesDownloadApiResponse = Blob;

export type TempStorageMyFilesApiArg = BaseListApiArg;
export type TempStorageMyFilesApiResponse = HttpResponse<TempFile[]>;