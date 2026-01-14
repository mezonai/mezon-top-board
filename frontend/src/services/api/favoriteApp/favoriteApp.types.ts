import { HttpResponse } from '@app/types/API.types';
import { BaseListApiArg } from '@app/types/common.types';
import { GetMezonAppDetailsResponse } from '../mezonApp/mezonApp.types';

export type AddFavoriteAppRequest = {
  id: string;
};

export type FavoriteAppControllerGetFavoriteAppsApiArg = BaseListApiArg;
export type FavoriteAppControllerGetFavoriteAppsApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>;

export type FavoriteAppControllerGetFavoriteAppDetailApiArg = { id: string };
export type FavoriteAppControllerGetFavoriteAppDetailApiResponse = HttpResponse<GetMezonAppDetailsResponse>;

export type FavoriteAppControllerAddFavoriteAppApiArg = AddFavoriteAppRequest;
export type FavoriteAppControllerAddFavoriteAppApiResponse = HttpResponse<{ message: string }>;

export type FavoriteAppControllerRemoveFavoriteAppApiArg = { id: string };
export type FavoriteAppControllerRemoveFavoriteAppApiResponse = HttpResponse<{ message: string }>;