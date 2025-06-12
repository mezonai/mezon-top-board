import { mediaService } from '@app/services/api/media/media'
import { MediaControllerGetAllMediaApiResponse } from '@app/services/api/media/media.types'
import { createSlice } from '@reduxjs/toolkit'

export interface IMediaStore {
  mediaList: MediaControllerGetAllMediaApiResponse
}

const initialState: IMediaStore = {
  mediaList: {} as MediaControllerGetAllMediaApiResponse
}

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(mediaService.endpoints.mediaControllerGetAllMedia.matchFulfilled, (state, { payload }) => {
      state.mediaList = payload
    })
  }
})

export const mediaReducer = mediaSlice.reducer
export const {} = mediaSlice.actions
