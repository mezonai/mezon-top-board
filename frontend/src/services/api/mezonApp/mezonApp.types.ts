import { HttpResponse, PaginationParams, RequestWithId } from '@app/types/API.types'
import { User } from '@app/types/User.types'
import { App } from '@app/types/App.types'
import { TagBase } from '@app/types/Tag.types'
import { LinkType, LinkTypeBase } from '@app/types/LinkType.types'

export type MezonAppControllerGetMezonAppApiArg = {
  search?: string
  tags?: string[]
} & PaginationParams

export type MezonAppControllerDeleteMezonAppApiArg = {
  requestWithId: RequestWithId
}

export type MezonAppControllerCreateMezonAppApiArg = {
  createMezonAppRequest: CreateMezonAppRequest
}

export type MezonAppControllerUpdateMezonAppApiArg = {
  updateMezonAppRequest: UpdateMezonAppRequest
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

export type OwnerInMezonAppDetailResponse = Pick<User, 'id' | 'name' | 'profileImage'>
export type TagInMezonAppDetailResponse = Omit<TagBase, 'slug'>
export type SocialLinkInMezonAppDetailResponse = {
  id: string
  url: string
  linkTypeId: string
  type: LinkTypeBase
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

export type Link = {
  url: string
  ownerId: string
  showOnProfile: boolean
  linkTypeId: string
  type: Omit<LinkType, 'id' | 'prefixUrl'>
  apps: App[]
  owner: User
}

export type SocialLink = {
  url?: string
  linkTypeId: string
  type?: LinkTypeBase
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

export type GetRelatedMezonAppResponse = Pick<
  GetMezonAppDetailsResponse,
  'id' | 'name' | 'status' | 'featuredImage' | 'rateScore'
>

export enum Status {
  $0 = 0,
  $1 = 1,
  $2 = 2,
  $3 = 3
}
