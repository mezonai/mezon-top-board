import { HttpResponse, RequestWithId } from '@app/types/API.types';
import { Media } from '@app/types/media.types';
import { BaseListApiArg } from '@app/types/common.types';

export type MediaResponse = Omit<Media, 'owner'> 

export type DeleteMediaRequest = RequestWithId;

export type MediaControllerGetAllMediaApiArg = BaseListApiArg; 
export type MediaControllerGetAllMediaApiResponse = HttpResponse<MediaResponse[]>;

export type MediaControllerGetMediaApiResponse = unknown; // TODO: define type
export type MediaControllerGetMediaApiArg = {
  id: string;
};

export type MediaControllerCreateMediaApiResponse = HttpResponse<MediaResponse>;

export type MediaControllerDeleteMediaApiResponse = unknown; // TODO: define type
export type MediaControllerDeleteMediaApiArg = {
  deleteMediaRequest: DeleteMediaRequest;
};