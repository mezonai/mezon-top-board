import {
  GetMezonAppDetailsResponse,
  GetRelatedMezonAppResponse,
  MezonAppControllerSearchMezonAppApiResponse
} from '@app/services/api/mezonApp/mezonApp.types'
import { createSlice } from '@reduxjs/toolkit'
import { mezonAppExtraReducers } from './extraReducer'

export interface IMezonAppStore {
  mezonApp: MezonAppControllerSearchMezonAppApiResponse;
  mezonAppOfAdmin: MezonAppControllerSearchMezonAppApiResponse;
  mezonAppDetail: GetMezonAppDetailsResponse
  relatedMezonApp: GetRelatedMezonAppResponse[]
  mezonAppOfUser: MezonAppControllerSearchMezonAppApiResponse
}

const initialState: IMezonAppStore = {
  mezonApp: {} as MezonAppControllerSearchMezonAppApiResponse,
  mezonAppOfAdmin: {} as MezonAppControllerSearchMezonAppApiResponse,
  mezonAppDetail: {} as GetMezonAppDetailsResponse,
  relatedMezonApp: [],
  mezonAppOfUser: {} as MezonAppControllerSearchMezonAppApiResponse
}

const mezonAppSlice = createSlice({
  name: 'mezonApp',
  initialState,
  reducers: {},
  extraReducers: mezonAppExtraReducers
})

export const mezonAppReducer = mezonAppSlice.reducer
export const {} = mezonAppSlice.actions
