import { api } from '../../apiInstance'
import type {
  ReviewHistoryControllerSearchAppReviewsApiResponse,
  ReviewHistoryControllerSearchAppReviewsApiArg,
  ReviewHistoryControllerCreateAppReviewApiResponse,
  ReviewHistoryControllerCreateAppReviewApiArg,
  ReviewHistoryControllerUpdateAppReviewApiResponse,
  ReviewHistoryControllerUpdateAppReviewApiArg,
  ReviewHistoryControllerDeleteAppReviewApiResponse,
  ReviewHistoryControllerDeleteAppReviewApiArg
} from './reviewHistory.types'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    reviewHistoryControllerSearchAppReviews: build.query<
      ReviewHistoryControllerSearchAppReviewsApiResponse,
      ReviewHistoryControllerSearchAppReviewsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/review-history/search`,
        params: {
          search: queryArg.search,
          appId: queryArg.appId,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    reviewHistoryControllerCreateAppReview: build.mutation<
      ReviewHistoryControllerCreateAppReviewApiResponse,
      ReviewHistoryControllerCreateAppReviewApiArg
    >({
      query: (queryArg) => ({ url: `/api/review-history`, method: 'POST', body: queryArg.createAppReviewRequest })
    }),
    reviewHistoryControllerUpdateAppReview: build.mutation<
      ReviewHistoryControllerUpdateAppReviewApiResponse,
      ReviewHistoryControllerUpdateAppReviewApiArg
    >({
      query: (queryArg) => ({ url: `/api/review-history`, method: 'PUT', body: queryArg.updateAppReviewRequest })
    }),
    reviewHistoryControllerDeleteAppReview: build.mutation<
      ReviewHistoryControllerDeleteAppReviewApiResponse,
      ReviewHistoryControllerDeleteAppReviewApiArg
    >({
      query: (queryArg) => ({ url: `/api/review-history`, method: 'DELETE', body: queryArg.requestWithId })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as reviewHistoryService }

export const {
  useReviewHistoryControllerSearchAppReviewsQuery,
  useLazyReviewHistoryControllerSearchAppReviewsQuery,
  useReviewHistoryControllerCreateAppReviewMutation,
  useReviewHistoryControllerUpdateAppReviewMutation,
  useReviewHistoryControllerDeleteAppReviewMutation
} = injectedRtkApi