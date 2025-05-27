import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { tagService } from '@app/services/api/tag/tag'
import { ITagStore } from '@app/store/tag'
import { TagResponse } from '@app/services/api/tag/tag'

export const tagExtraReducers = (builder: ActionReducerMapBuilder<ITagStore>) => {
  builder
    .addMatcher(tagService.endpoints.tagControllerGetTags.matchFulfilled, (state, { payload }) => {
      state.tagList = payload
    })

    .addMatcher(tagService.endpoints.tagControllerSearchTags.matchFulfilled, (state, { payload }) => {
      if (payload.pageNumber === 1) {
        state.searchTagList = payload
      } else {
        state.searchTagList = {
          ...payload,
          data: [...(state.searchTagList?.data || []), ...payload.data]
        }
      }
    })

    .addMatcher(tagService.endpoints.tagControllerCreateTag.matchFulfilled, (state, { payload }) => {
      if (state.tagList?.data) {
        state.tagList.data.unshift(payload.data)
      }
      if (state.searchTagList?.data) {
        state.searchTagList.data.unshift(payload.data)
      }
    })

    .addMatcher(tagService.endpoints.tagControllerDeleteTag.matchFulfilled, (state, action) => {
      const deletedId = action.meta.arg.originalArgs.requestWithId.id
      if (state.tagList?.data) {
        state.tagList.data = state.tagList.data.filter((tag: TagResponse) => tag.id !== deletedId)
      }
      if (state.searchTagList?.data) {
        state.searchTagList.data = state.searchTagList.data.filter((tag: TagResponse) => tag.id !== deletedId);
      }
    })

    .addMatcher(tagService.endpoints.tagControllerUpdateTag.matchFulfilled, (state, { payload }) => {
      const updatedTag = payload.data
      if (state.tagList?.data) {
        const index = state.tagList.data.findIndex((tag: TagResponse) => tag.id === updatedTag.id)
        if (index !== -1) {
          state.tagList.data[index] = {
            ...state.tagList.data[index],
            ...updatedTag
          }
        }
      }
      if (state.searchTagList?.data) {
        const index = state.searchTagList.data.findIndex((tag: TagResponse) => tag.id === updatedTag.id);
        if (index !== -1) {
          state.searchTagList.data[index] = {
            ...state.searchTagList.data[index],
            ...updatedTag,
          };
        }
      }
    })
}
