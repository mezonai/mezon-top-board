import { LinkTypeControllerGetAllLinksApiResponse } from '@app/services/api/linkType/linkType.types'
import { createSlice } from '@reduxjs/toolkit'
import { linkTypeExtraReducers } from './extraReducer'

export interface ILinkTypeStore {
  linkTypeList: LinkTypeControllerGetAllLinksApiResponse
}

const initialState: ILinkTypeStore = {
  linkTypeList: {} as LinkTypeControllerGetAllLinksApiResponse
}

const linkTypeSlice = createSlice({
  name: 'link',
  initialState,
  reducers: {},
  extraReducers: linkTypeExtraReducers
})

export const linkTypeReducer = linkTypeSlice.reducer
export const { } = linkTypeSlice.actions
