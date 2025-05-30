import { HttpResponse, PaginationParams, RequestWithId } from '@app/types/API.types'
import { LinkTypeResponse } from '../linkType/linkType'
import { User } from '@app/types/User.types'
import { App } from '@app/types/App.types'

export type MezonAppControllerListAdminMezonAppApiArg = {
  search?: string
  tags?: string[]
} & PaginationParams

export type MezonAppControllerGetMyAppApiArg = {
  search?: string
  tags?: string[]
} & PaginationParams

export type MezonAppControllerGetMezonAppDetailApiArg = {
  id: string
}

export type MezonAppControllerDeleteMezonAppApiArg = {
  requestWithId: RequestWithId
}

export type MezonAppControllerCreateMezonAppApiArg = {
  createMezonAppRequest: CreateMezonAppRequest
}

export type MezonAppControllerUpdateMezonAppApiArg = {
  updateMezonAppRequest: UpdateMezonAppRequest
}

export type MezonAppControllerGetRelatedMezonAppApiArg = {
  id: string
}

export type MezonAppControllerSearchMezonAppApiArg = {
  search?: string
  ownerId?: string
  tags?: string[]
} & PaginationParams

export type MezonAppControllerListAdminMezonAppApiResponse = unknown
export type MezonAppControllerGetMyAppApiResponse = unknown
export type MezonAppControllerGetMezonAppDetailApiResponse = HttpResponse<GetMezonAppDetailsResponse>
export type MezonAppControllerDeleteMezonAppApiResponse = HttpResponse<any>
export type MezonAppControllerGetRelatedMezonAppApiResponse = HttpResponse<GetRelatedMezonAppResponse[]>
export type MezonAppControllerSearchMezonAppApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>

export type OwnerInMezonAppDetailResponse = { id: string; name: string; profileImage: string }
export type TagInMezonAppDetailResponse = { id: string; name: string }
export type SocialLinkInMezonAppDetailResponse = {
  id: string
  url: string
  linkTypeId: string
  type: LinkTypeResponse
}
export type GetMezonAppDetailsResponse = {
  id: string
  name: string
  description: string
  prefix: string
  headline: string
  featuredImage: string
  status: number
  owner: OwnerInMezonAppDetailResponse
  tags: TagInMezonAppDetailResponse[]
  socialLinks: SocialLinkInMezonAppDetailResponse[]
  rateScore: number
  installLink: string
  supportUrl: string
}

export type LinkType = { 
  name: string; 
  icon: string; 
  links: Link[] 
}
export type Media = { 
  fileName: string; 
  mimeType: string; 
  filePath: string; 
  ownerId: string; 
  owner: User
}

export type Link = {
  url: string
  ownerId: string
  showOnProfile: boolean
  linkTypeId: string
  type: LinkType
  apps: App[]
  owner: User
}

export type SocialLink = {
  url?: string
  linkTypeId: string
  type?: LinkTypeResponse
}

export type CreateMezonAppRequest = {
  name: string
  isAutoPublished?: boolean
  installLink: string
  headline: string
  description: string
  prefix: string
  featuredImage?: string
  supportUrl: string
  remark?: string
  tagIds: string[]
  socialLinks?: SocialLink[]
}

export type UpdateMezonAppRequest = {
  id: string
} & Partial<Omit<CreateMezonAppRequest, 'id'>>

export type GetRelatedMezonAppResponse = {
  id: string
  name: string
  status: number
  featuredImage: string
  rateScore: number
}

export enum Status {
  $0 = 0,
  $1 = 1,
  $2 = 2,
  $3 = 3
}
