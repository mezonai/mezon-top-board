import { HttpResponse, PaginationParams, RequestWithId } from '@app/types/API.types'
import { AppReviewHistory, AppReviewHistoryBase } from '@app/types/AppReviewHistory.types'

export type ReviewHistoryControllerSearchAppReviewsApiArg = {
  search?: string
  appId?: string
} & PaginationParams 

export type CreateAppReviewRequest = Omit<AppReviewHistoryBase, 'reviewedAt' | 'reviewerId'>

export type UpdateAppReviewRequest = {
  id: string
  remark: string
}

export type AppReviewHistoryResponse = {
  id: string
} & AppReviewHistory

export type ReviewHistoryControllerSearchAppReviewsApiResponse = HttpResponse<AppReviewHistoryResponse[]>

export type ReviewHistoryControllerCreateAppReviewApiArg = {
  createAppReviewRequest: CreateAppReviewRequest
}
export type ReviewHistoryControllerCreateAppReviewApiResponse = unknown

export type ReviewHistoryControllerUpdateAppReviewApiArg = {
  updateAppReviewRequest: UpdateAppReviewRequest
}
export type ReviewHistoryControllerUpdateAppReviewApiResponse = unknown

export type ReviewHistoryControllerDeleteAppReviewApiArg = {
  requestWithId: RequestWithId
}
export type ReviewHistoryControllerDeleteAppReviewApiResponse = unknown

