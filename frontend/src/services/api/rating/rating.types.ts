import { HttpResponse } from "@app/types/API.types"
import { Rating } from "@app/types/Rating.types"

export type CreateRatingRequest = {
  appId: string
  score: number
  comment: string
}

export type RatingControllerCreateRatingApiResponse = unknown
export type RatingControllerCreateRatingApiArg = {
  createRatingRequest: CreateRatingRequest
}

export type RatingControllerGetRatingByAppApiResponse = HttpResponse<Rating[]>
export type RatingControllerGetRatingByAppApiArg = {
  appId: string
  pageNumber?: number
}

