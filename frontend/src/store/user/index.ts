import { GetPublicProfileResponse, GetUserDetailsResponse, UserControllerSearchUserApiResponse } from '@app/services/api/user/user'
import { createSlice } from '@reduxjs/toolkit'
import { manageUsersExtraReducers } from './extraReducer'

export interface IUserStore {
  userInfo: GetUserDetailsResponse,
  publicProfile: GetPublicProfileResponse,
  adminUserList?: UserControllerSearchUserApiResponse,
}

const initialState: IUserStore = {
  userInfo: {} as GetUserDetailsResponse,
  publicProfile: {} as GetPublicProfileResponse,
  adminUserList: {} as UserControllerSearchUserApiResponse,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserInfo: (state) => {
      state.userInfo = {} as GetUserDetailsResponse
    }
  },
  extraReducers: manageUsersExtraReducers
})

export const userReducer = userSlice.reducer
export const { clearUserInfo } = userSlice.actions
