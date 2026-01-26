import { api } from '../../apiInstance';
import type {
  FavoriteAppControllerGetFavoriteAppsApiResponse,
  FavoriteAppControllerGetFavoriteAppsApiArg,
  FavoriteAppControllerGetFavoriteAppDetailApiResponse,
  FavoriteAppControllerGetFavoriteAppDetailApiArg,
  FavoriteAppControllerAddFavoriteAppApiResponse,
  FavoriteAppControllerAddFavoriteAppApiArg,
  FavoriteAppControllerRemoveFavoriteAppApiResponse,
  FavoriteAppControllerRemoveFavoriteAppApiArg,
} from './favoriteApp.types';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    favoriteAppControllerGetFavoriteApps: build.query<
      FavoriteAppControllerGetFavoriteAppsApiResponse,
      FavoriteAppControllerGetFavoriteAppsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/favorite-app`,
        params: {
          pageNumber: queryArg.pageNumber,
          pageSize: queryArg.pageSize,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder,
        },
      }),
    }),

    favoriteAppControllerGetFavoriteAppDetail: build.query<
      FavoriteAppControllerGetFavoriteAppDetailApiResponse,
      FavoriteAppControllerGetFavoriteAppDetailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/favorite-app/${queryArg.id}`,
      }),
    }),

    favoriteAppControllerAddFavoriteApp: build.mutation<
      FavoriteAppControllerAddFavoriteAppApiResponse,
      FavoriteAppControllerAddFavoriteAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/favorite-app`,
        method: 'POST',
        body: queryArg,
      }),
    }),

    favoriteAppControllerRemoveFavoriteApp: build.mutation<
      FavoriteAppControllerRemoveFavoriteAppApiResponse,
      FavoriteAppControllerRemoveFavoriteAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/favorite-app/${queryArg.id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as favoriteService };

export const {
  useFavoriteAppControllerGetFavoriteAppsQuery,
  useLazyFavoriteAppControllerGetFavoriteAppsQuery,
  useFavoriteAppControllerGetFavoriteAppDetailQuery,
  useLazyFavoriteAppControllerGetFavoriteAppDetailQuery,
  useFavoriteAppControllerAddFavoriteAppMutation,
  useFavoriteAppControllerRemoveFavoriteAppMutation,
} = injectedRtkApi;