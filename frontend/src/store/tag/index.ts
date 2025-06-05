import { createSlice } from '@reduxjs/toolkit'
import { tagExtraReducers } from './extraReducer'
import { TagListApiResponse } from '@app/services/api/tag/tag.types'

export interface ITagStore {
  tagList: TagListApiResponse
  searchTagList: TagListApiResponse
}

const initialState: ITagStore = {
  tagList: {} as TagListApiResponse,
  searchTagList: {} as TagListApiResponse
} 

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: tagExtraReducers
})

export const tagReducer = tagSlice.reducer
export const {} = tagSlice.actions
