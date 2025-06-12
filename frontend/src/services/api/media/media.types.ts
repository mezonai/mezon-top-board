import { HttpResponse, RequestWithId } from "@app/types/API.types"
import { MediaFileBase } from "@app/types/Media.types"

export type MediaControllerGetAllMediaApiResponse = HttpResponse<UploadedFile[]>

export type MediaControllerGetMediaApiResponse = unknown

export type MediaControllerCreateMediaApiResponse = HttpResponse<UploadedFile>
export type MediaControllerCreateMediaApiArg = {
  createMediaRequest: CreateMediaRequest
}

export type MediaControllerDeleteMediaApiResponse = unknown
export type MediaControllerDeleteMediaApiArg = {
  deleteMediaRequest: RequestWithId
}

export type CreateMediaRequest = {
  file: Blob
}
export type UploadedFile = MediaFileBase & {
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

