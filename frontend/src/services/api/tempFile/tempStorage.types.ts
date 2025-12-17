import { HttpResponse } from '@app/types/API.types';
import { BaseListApiArg } from '@app/types/common.types';
import { TempFile } from '@app/types/tempFile.types';

export type TempStorageControllerSearchTempFileshApiArg = BaseListApiArg & {
  ownerId?: string;
};
export type TempStorageControllerSearchTempFilesApiResponse = HttpResponse<TempFile[]>;

export type TempStorageControllerGetTempFileApiArg = {
  id: string;
};
export type TempStorageControllerGetTempFileApiResponse = HttpResponse<TempFile>;

export type TempFilesDownloadApiArg = {
  filePath: string;
};
export type TempFilesDownloadApiResponse = Blob;

export type TempStorageControllerGetMyTempFilesApiArg = BaseListApiArg;
export type TempStorageControllerGetMyTempFilesApiResponse = HttpResponse<TempFile[]>;