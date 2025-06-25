import { Rating, ratingService } from "@app/services/api/rating/rating"
import { ActionReducerMapBuilder } from "@reduxjs/toolkit"

export const ratingExtraReducers = (builder: ActionReducerMapBuilder<any>) => {
  builder
    .addMatcher(ratingService.endpoints.ratingControllerGetRatingsByApp.matchFulfilled, (state, { payload }) => {
      const existingRatings = state.ratings?.data ?? []
      const isFirstPage = payload.pageNumber === 1
      state.ratings = {
        ...payload,
        data: isFirstPage
          ? payload.data
          : [
              ...existingRatings,
              ...payload.data.filter(
                (newRating) => !existingRatings.some((existingRating: Rating) => existingRating.id === newRating.id)
              )
            ]
      }
    })
    .addMatcher(ratingService.endpoints.ratingControllerGetRatingsByApp.matchRejected, (state, { payload }) => {
      state.ratings = {}
    })
    .addMatcher(ratingService.endpoints.ratingControllerCreateRating.matchFulfilled, (state, { payload }) => {
      state.ratings.data.unshift(payload)
    })
}
