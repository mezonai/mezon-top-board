import { RatingControllerGetRatingByAppApiResponse } from '@app/services/api/rating/rating.types';
import { createSlice } from '@reduxjs/toolkit';
import { ratingExtraReducers } from './extraReducer';

export interface IRatingStore {
  ratings: RatingControllerGetRatingByAppApiResponse;
}

const initialState: IRatingStore = {
  ratings: {} as RatingControllerGetRatingByAppApiResponse
}

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {},
  extraReducers: ratingExtraReducers
})

export const ratingReducer = ratingSlice.reducer
export const {} = ratingSlice.actions
