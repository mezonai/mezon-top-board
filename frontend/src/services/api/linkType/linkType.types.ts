import { HttpResponse, RequestWithId } from '@app/types/API.types'
import { LinkTypeBase } from '@app/types/LinkType.types'

export type UpdateLinkTypeRequest = Partial<Omit<LinkTypeBase, 'id'>> & { id: string }

export type CreateLinkTypeRequest = Omit<LinkTypeBase, 'id'>

export type LinkTypeControllerGetAllLinksApiResponse = HttpResponse<LinkTypeBase[]>
export type LinkTypeControllerGetAllLinksApiArg = void

// LinkTypeControllerUpdateLinkTypeApiResponse & LinkTypeControllerCreateLinkTypeApiResponse & LinkTypeControllerDeleteLinkTypeApiResponse
export type LinkTypeMutationResponse = HttpResponse<LinkTypeBase>
export type LinkTypeControllerUpdateLinkTypeApiArg = {
  updateLinkTypeRequest: UpdateLinkTypeRequest
}
export type LinkTypeControllerCreateLinkTypeApiArg = {
  createLinkTypeRequest: CreateLinkTypeRequest
}
export type LinkTypeControllerDeleteLinkTypeApiArg = {
  requestWithId: RequestWithId
}
