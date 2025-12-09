import { HttpResponse } from "@app/types/API.types";
import { BaseListApiArg } from "@app/types/common.types"
import { TempFile } from "@app/types/tempFile.types"

export type TempFileResponse = Omit<TempFile, 'owner'>

export type TempFileControllerGetAllTempFileApiArg = BaseListApiArg & { ownerId?: string }; 
export type TempFileControllerGetAllTempFileApiResponse = HttpResponse<TempFileResponse[]>;

export type TempFileControllerGetMyTempFileApiArg = BaseListApiArg;
export type TempFileControllerGetMyTempFileApiResponse = HttpResponse<TempFileResponse[]>;

export type TempFileControllerGetTempFileApiResponse = unknown; // TODO: define type
export type TempFileControllerGetTempFileApiArg = {
  id: string;
};