import { App, mezonAppService } from "@app/services/api/mezonApp/mezonApp"
import { ActionReducerMapBuilder } from "@reduxjs/toolkit"

export const mezonAppExtraReducers = (builder: ActionReducerMapBuilder<any>) => {
  builder
    .addMatcher(mezonAppService.endpoints.mezonAppControllerSearchMezonApp.matchFulfilled, (state, { payload }) => {
      state.mezonApp = payload
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerListAdminMezonApp.matchFulfilled, (state, { payload }) => {
      state.mezonAppOfAdmin = payload
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerGetMezonAppDetail.matchFulfilled, (state, { payload }) => {
      state.mezonAppDetail = payload.data
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerGetRelatedMezonApp.matchFulfilled, (state, { payload }) => {
      state.relatedMezonApp = payload.data
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerGetMyApp.matchFulfilled, (state, { payload }) => {
      state.mezonAppOfUser = payload
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerDeleteMezonApp.matchFulfilled, (state, action) => {
      const deletedId = action.meta.arg.originalArgs.requestWithId.id;
      if (state.mezonAppOfAdmin.data)
        state.mezonAppOfAdmin.data = state.mezonAppOfAdmin.data.filter((app: App) => app.id !== deletedId);
      else if (state.mezonAppOfUser.data)
        state.mezonAppOfUser.data = state.mezonAppOfUser.data.filter((app: App) => app.id !== deletedId)
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerCreateMezonApp.matchFulfilled, (state, { payload }) => {
      if (state.mezonApp?.data) {
        state.mezonApp.data.unshift(payload);
      }
    })
    .addMatcher(mezonAppService.endpoints.mezonAppControllerUpdateMezonApp.matchFulfilled, (state, { payload }) => {
      if (state.mezonAppOfAdmin?.data) {
        const index = state.mezonAppOfAdmin.data.findIndex((app: App) => app.id === payload.id);
        if (index !== -1) {
          state.mezonAppOfAdmin.data[index] = {
            ...state.mezonAppOfAdmin.data[index],
            ...payload
          };
        }
      }
    })
}
