import { api } from "../../apiInstance"
import type {
  RatingControllerCreateRatingApiResponse,
  RatingControllerCreateRatingApiArg,
  RatingControllerGetRatingByAppApiResponse,
  RatingControllerGetRatingByAppApiArg,
  RatingControllerGetAllRatingsByAppApiResponse,
  RatingControllerGetAllRatingsByAppApiArg
} from "./rating.types"

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    ratingControllerCreateRating: build.mutation<
      RatingControllerCreateRatingApiResponse,
      RatingControllerCreateRatingApiArg
    >({
      query: (queryArg) => ({ url: `/api/rating`, method: "POST", body: queryArg.createRatingRequest })
    }),
    ratingControllerGetAllRatingsByApp: build.query<
      RatingControllerGetRatingByAppApiResponse,
      RatingControllerGetRatingByAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/rating/get-all-by-app`,
        params: {
          appId: queryArg.appId
        }
      })
    }),
    ratingControllerGetRatingsByApp: build.query<
      RatingControllerGetRatingByAppApiResponse,
      RatingControllerGetRatingByAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/rating/get-by-app`,
        params: {
          appId: queryArg.appId,
          pageNumber: queryArg.pageNumber
        }
      })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as ratingService }

export const {
  useRatingControllerCreateRatingMutation,
  useRatingControllerGetRatingsByAppQuery,
  useLazyRatingControllerGetRatingsByAppQuery,
  useLazyRatingControllerGetAllRatingsByAppQuery
} = injectedRtkApi