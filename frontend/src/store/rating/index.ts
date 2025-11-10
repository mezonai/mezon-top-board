import { RatingControllerGetRatingByAppApiResponse } from '@app/services/api/rating/rating';
import { createSlice } from '@reduxjs/toolkit';
import { ratingExtraReducers } from './extraReducer';

export interface IRatingStore {
  ratings: RatingControllerGetRatingByAppApiResponse;
  allRatings: RatingControllerGetRatingByAppApiResponse
}

const initialState: IRatingStore = {
  ratings: {} as RatingControllerGetRatingByAppApiResponse,
  allRatings: {} as RatingControllerGetRatingByAppApiResponse
}

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {},
  extraReducers: ratingExtraReducers
})

export const ratingReducer = ratingSlice.reducer
export const {} = ratingSlice.actions
