import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { linkTypeService } from '@app/services/api/linkType/linkType'
import { LinkTypeResponse } from '@app/services/api/linkType/linkType.types'
import { ILinkTypeStore } from '.'

export const linkTypeExtraReducers = (builder: ActionReducerMapBuilder<ILinkTypeStore>) => {
  builder
    .addMatcher(linkTypeService.endpoints.linkTypeControllerGetAllLinks.matchFulfilled, (state, { payload }) => {
      state.linkTypeList = payload
    })

    .addMatcher(linkTypeService.endpoints.linkTypeControllerCreateLinkType.matchFulfilled, (state, { payload }) => {
      if (state.linkTypeList?.data) {
        state.linkTypeList.data.unshift(payload.data)
      }
    })

    .addMatcher(linkTypeService.endpoints.linkTypeControllerDeleteLinkType.matchFulfilled, (state, action) => {
      const deletedId = action.meta.arg.originalArgs.requestWithId.id
      if (state.linkTypeList?.data) {
        state.linkTypeList.data = state.linkTypeList.data.filter((linkType: LinkTypeResponse) => linkType.id !== deletedId)
      }
    })

    .addMatcher(linkTypeService.endpoints.linkTypeControllerUpdateLinkType.matchFulfilled, (state, { payload }) => {
      const updatedTag = payload.data
      if (state.linkTypeList?.data) {
        const index = state.linkTypeList.data.findIndex((linkType: LinkTypeResponse) => linkType.id === updatedTag.id)
        if (index !== -1) {
          state.linkTypeList.data[index] = {
            ...state.linkTypeList.data[index],
            ...updatedTag
          }
        }
      }
    })
}