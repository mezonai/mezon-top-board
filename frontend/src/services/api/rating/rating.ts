import { api } from "../../apiInstance"
import {
  RatingControllerCreateRatingApiArg,
  RatingControllerCreateRatingApiResponse,
  RatingControllerGetRatingByAppApiArg,
  RatingControllerGetRatingByAppApiResponse
} from "./rating.types"

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    ratingControllerCreateRating: build.mutation<
      RatingControllerCreateRatingApiResponse,
      RatingControllerCreateRatingApiArg
    >({
      query: (queryArg) => ({ url: `/api/rating`, method: "POST", body: queryArg.createRatingRequest })
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
  useLazyRatingControllerGetRatingsByAppQuery
} = injectedRtkApi
