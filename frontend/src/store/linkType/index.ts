import { createSlice } from '@reduxjs/toolkit'
import { linkTypeExtraReducers } from './extraReducer'
import { LinkTypeControllerGetAllLinksApiResponse } from '@app/services/api/linkType/linkType.types'

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
