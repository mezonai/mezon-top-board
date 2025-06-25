import { GetUserDetailsResponse, UpdateUserRequest, userService } from "@app/services/api/user/user"
import { ActionReducerMapBuilder } from "@reduxjs/toolkit"

export const manageUsersExtraReducers = (builder: ActionReducerMapBuilder<any>) => {
  builder
    .addMatcher(userService.endpoints.userControllerSearchUser.matchFulfilled, (state, action) => {
      state.adminUserList = action.payload
    })
    .addMatcher(userService.endpoints.userControllerUpdateUser.matchFulfilled, (state, action) => {
      const updatedUser = action.meta.arg.originalArgs.updateUserRequest
      // Loop through all pages and update the user if found

      const page = state.adminUserList;
      const index = page.findIndex((user: UpdateUserRequest) => user.id === updatedUser.id)
      if (index !== -1) {
        // Update only `name`, `bio`, and `role` fields, keeping other properties intact
        state.adminUserList[index] = {
          ...page[index], // Keep existing fields
          ...updatedUser // Overwrite updated fields
        }
      }
    })
    .addMatcher(userService.endpoints.userControllerGetUserDetails.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload.data
      state.userInfo.name = payload.data.name || payload.data.email.split("@")[0]
    })
    .addMatcher(userService.endpoints.userControllerSelfUpdateUser.matchFulfilled, (state, { meta }) => {
      const { name, bio, profileImage } = meta.arg.originalArgs.selfUpdateUserRequest
      if (name) state.userInfo.name = name
      if (bio) state.userInfo.bio = bio
      if (profileImage) state.userInfo.profileImage = profileImage
    })
    .addMatcher(userService.endpoints.userControllerGetPublicProfile.matchFulfilled, (state, { payload }) => {
      state.publicProfile = payload.data
      state.publicProfile.name = payload.data.name || "User"
    })
    .addMatcher(userService.endpoints.userControllerDeactivateUser.matchFulfilled, (state, action) => {
      const deactiveId = action.meta.arg.originalArgs.requestWithId.id

      state.adminUserList = state.adminUserList?.map((user: GetUserDetailsResponse) => {
        if (user.id === deactiveId) {
          return { ...user, deletedAt: new Date() } // Set deletedAt to current date
        }
        return user
      })
    })
    .addMatcher(userService.endpoints.userControllerActivateUser.matchFulfilled, (state, action) => {
      const activeId = action.meta.arg.originalArgs.requestWithId.id

      state.adminUserList = state.adminUserList?.map((user: GetUserDetailsResponse) => {
        if (user.id === activeId) {
          return { ...user, deletedAt: null } // Set deletedAt to null
        }
        return user
      })
    })
}
