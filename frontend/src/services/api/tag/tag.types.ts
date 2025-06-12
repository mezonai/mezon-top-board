import { HttpResponse, PaginationParams, RequestWithId } from '@app/types/API.types'
import { TagBase } from '@app/types/Tag.types'

export type TagResponse = {
  botCount: number
} & TagBase

export type CreateTagRequest = Omit<TagBase, 'id'>

export type UpdateTagRequest = Partial<Omit<TagBase, 'id'>> & { id: string }

export type TagListApiResponse = HttpResponse<TagResponse[]>
export type TagControllerGetTagsApiArg = void

export type TagControllerSearchTagsApiArg = {
  search?: string
  tags?: string[]
} & PaginationParams

export type TagControllerMutateTagApiResponse = HttpResponse<TagResponse>
export type TagControllerCreateTagApiArg = {
  createTagRequest: CreateTagRequest
}

export type TagControllerUpdateTagApiArg = {
  updateTagRequest: UpdateTagRequest
}

export type TagControllerDeleteTagApiResponse = HttpResponse<CreateTagRequest>
export type TagControllerDeleteTagApiArg = {
  requestWithId: RequestWithId
}
