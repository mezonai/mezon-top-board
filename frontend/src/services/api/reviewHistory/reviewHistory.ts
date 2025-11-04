import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
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
export type ReviewHistoryControllerSearchAppReviewsApiResponse = HttpResponse<ReviewHistoryResponse[]>
export type ReviewHistoryControllerSearchAppReviewsApiArg = {
  search?: string
  appId?: string
  pageSize: number
  pageNumber: number
  sortField: string
  sortOrder: 'ASC' | 'DESC'
}


type Reviewer = {
  id: string
  name: string
  email: string
  role: string
}
 
type AppInfo = {
  id: string
  name: string
  type: MezonAppType
  mezonAppId?: string
  description: string | null
  headline: string | null
  featuredImage: string | null
}

type ReviewHistory = {
  id: string
  remark: string
  reviewer: Reviewer
  reviewedAt: Date
  app: AppInfo
}

export type ReviewHistoryResponse = ReviewHistory

export type ReviewHistoryControllerCreateAppReviewApiResponse = unknown
export type ReviewHistoryControllerCreateAppReviewApiArg = {
  createAppReviewRequest: CreateAppReviewRequest
}
export type ReviewHistoryControllerUpdateAppReviewApiResponse = unknown
export type ReviewHistoryControllerUpdateAppReviewApiArg = {
  updateAppReviewRequest: UpdateAppReviewRequest
}
export type ReviewHistoryControllerDeleteAppReviewApiResponse = unknown
export type ReviewHistoryControllerDeleteAppReviewApiArg = {
  requestWithId: RequestWithId
}
export type CreateAppReviewRequest = {
  appId: string
  isApproved: boolean
  remark: string
}
export type UpdateAppReviewRequest = {
  id: string
  remark: string
}
export type RequestWithId = {
  id: string
}
export const {
  useReviewHistoryControllerSearchAppReviewsQuery,
  useLazyReviewHistoryControllerSearchAppReviewsQuery,
  useReviewHistoryControllerCreateAppReviewMutation,
  useReviewHistoryControllerUpdateAppReviewMutation,
  useReviewHistoryControllerDeleteAppReviewMutation
} = injectedRtkApi
