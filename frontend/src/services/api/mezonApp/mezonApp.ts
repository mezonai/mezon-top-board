import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { Rating } from '../rating/rating'
import { LinkTypeResponse } from '../linkType/linkType'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mezonAppControllerListAdminMezonApp: build.query<
      MezonAppControllerListAdminMezonAppApiResponse,
      MezonAppControllerListAdminMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/admin-all`,
        params: {
          search: queryArg.search,
          tags: queryArg.tags,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    mezonAppControllerGetMyApp: build.query<MezonAppControllerGetMyAppApiResponse, MezonAppControllerGetMyAppApiArg>({
      query: (queryArg) => ({
        url: `/api/mezon-app/my-app`,
        params: {
          search: queryArg.search,
          tags: queryArg.tags,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    }),
    mezonAppControllerGetMezonAppDetail: build.query<
      MezonAppControllerGetMezonAppDetailApiResponse,
      MezonAppControllerGetMezonAppDetailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app`,
        params: {
          id: queryArg.id
        }
      })
    }),
    mezonAppControllerDeleteMezonApp: build.mutation<
      MezonAppControllerDeleteMezonAppApiResponse,
      MezonAppControllerDeleteMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'DELETE', body: queryArg.requestWithId })
    }),
    mezonAppControllerCreateMezonApp: build.mutation<
      MezonAppControllerCreateMezonAppApiResponse,
      MezonAppControllerCreateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'POST', body: queryArg.createMezonAppRequest })
    }),
    mezonAppControllerUpdateMezonApp: build.mutation<
      MezonAppControllerUpdateMezonAppApiResponse,
      MezonAppControllerUpdateMezonAppApiArg
    >({
      query: (queryArg) => ({ url: `/api/mezon-app`, method: 'PUT', body: queryArg.updateMezonAppRequest })
    }),
    mezonAppControllerGetRelatedMezonApp: build.query<
      MezonAppControllerGetRelatedMezonAppApiResponse,
      MezonAppControllerGetRelatedMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/related-app`,
        params: {
          id: queryArg.id
        }
      })
    }),
    mezonAppControllerSearchMezonApp: build.query<
      MezonAppControllerSearchMezonAppApiResponse,
      MezonAppControllerSearchMezonAppApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mezon-app/search`,
        params: {
          ownerId: queryArg.ownerId,
          search: queryArg.search,
          tags: queryArg.tags,
          type: queryArg.type,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder
        }
      })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as mezonAppService }
export type MezonAppControllerListAdminMezonAppApiResponse = unknown
export type MezonAppControllerListAdminMezonAppApiArg = {
  /** Keyword to search mezonApps by name or headline */
  search?: string
  tags?: string[]
  pageSize: number
  pageNumber: number
  sortField: string
  sortOrder: 'ASC' | 'DESC'
}
export type MezonAppControllerGetMyAppApiResponse = unknown
export type MezonAppControllerGetMyAppApiArg = {
  /** Keyword to search mezonApps by name or headline */
  search?: string
  tags?: string[]
  pageSize: number
  pageNumber: number
  sortField: string
  sortOrder: 'ASC' | 'DESC'
}
export type MezonAppControllerGetMezonAppDetailApiResponse = HttpResponse<GetMezonAppDetailsResponse>
export type MezonAppControllerGetMezonAppDetailApiArg = {
  id: string
}
export type MezonAppControllerDeleteMezonAppApiResponse = HttpResponse<any>
export type MezonAppControllerDeleteMezonAppApiArg = {
  requestWithId: RequestWithId
}
export type MezonAppControllerCreateMezonAppApiResponse = /** status 201  */ App
export type MezonAppControllerCreateMezonAppApiArg = {
  createMezonAppRequest: CreateMezonAppRequest
}
export type MezonAppControllerUpdateMezonAppApiResponse = /** status 200  */ App
export type MezonAppControllerUpdateMezonAppApiArg = {
  updateMezonAppRequest: UpdateMezonAppRequest
}
export type MezonAppControllerGetRelatedMezonAppApiResponse = HttpResponse<GetRelatedMezonAppResponse[]>
export type MezonAppControllerGetRelatedMezonAppApiArg = {
  id: string
}
export type MezonAppControllerSearchMezonAppApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>

export type MezonAppControllerSearchMezonAppApiArg = {
  /** Keyword to search mezonApps by name or headline */
  search?: string
  ownerId?: string
  tags?: string[]
  type?: MezonAppType
  pageSize: number
  pageNumber: number
  sortField: string
  sortOrder: string
}
export type OwnerInMezonAppDetailResponse = {
  id: string
  name: string
  profileImage: string
}
export type TagInMezonAppDetailResponse = {
  id: string
  name: string
}
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
  pricingTag: 'FREE' | 'PAID'
  price: number
  socialLinks: SocialLinkInMezonAppDetailResponse[]
  rateScore: number
  type: MezonAppType
  mezonAppId?: string
  supportUrl: string
}
export type RequestWithId = {
  id: string
}
export type Tag = {
  name: string
  slug: string
  apps: App[]
}
export type LinkType = {
  name: string
  icon: string
  links: Link[]
}
export type Media = {
  fileName: string
  mimeType: string
  filePath: string
  ownerId: string
  owner: User
}
export type User = {
  id: string
  name: string | null
  email: string
  password: string
  role: Role
  bio: string
  ratings: Rating[]
  apps: App[]
  links: Link[]
  medias: Media[]
  profileImage: string
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
export type AppReviewHistory = {
  appId: string
  isApproved: boolean
  reviewerId: string
  reviewedAt: string
  remark: string
  app: App
  reviewer: User
}
export type App = {
  id?: string
  name: string
  ownerId: string
  status: Status
  isAutoPublished: boolean
  type: MezonAppType
  mezonAppId?: string
  headline: string
  description: string
  prefix: string
  featuredImage: string
  supportUrl: string
  remark: string
  tags: Tag[]
  socialLinks: Link[]
  reviewHistories: AppReviewHistory[]
  ratings: Rating[]
  owner: User
}
export type SocialLinkDto = {
  url?: string
  linkTypeId: string
  type?: LinkTypeResponse // For render only
}
export type CreateMezonAppRequest = {
  mezonAppId: string
  type: MezonAppType
  name: string
  isAutoPublished?: boolean
  headline: string
  description: string
  prefix?: string
  featuredImage?: string
  supportUrl: string
  remark?: string
  tagIds: string[]
  socialLinks?: SocialLinkDto[]
  pricingTag?: string
  price?: number
}
export type UpdateMezonAppRequest = {
  id: string
  name?: string
  isAutoPublished?: boolean
  type: MezonAppType
  mezonAppId?: string
  headline?: string
  description?: string
  prefix?: string
  featuredImage?: string
  supportUrl?: string
  remark?: string
  tagIds: string[]
  socialLinks?: SocialLinkDto[]
}
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
export enum Role {
  Admin = 'ADMIN',
  Developer = 'DEVELOPER'
}
export const {
  useMezonAppControllerListAdminMezonAppQuery,
  useLazyMezonAppControllerListAdminMezonAppQuery,
  useMezonAppControllerGetMyAppQuery,
  useLazyMezonAppControllerGetMyAppQuery,
  useMezonAppControllerGetMezonAppDetailQuery,
  useLazyMezonAppControllerGetMezonAppDetailQuery,
  useMezonAppControllerDeleteMezonAppMutation,
  useMezonAppControllerCreateMezonAppMutation,
  useMezonAppControllerUpdateMezonAppMutation,
  useMezonAppControllerGetRelatedMezonAppQuery,
  useLazyMezonAppControllerGetRelatedMezonAppQuery,
  useMezonAppControllerSearchMezonAppQuery,
  useLazyMezonAppControllerSearchMezonAppQuery
} = injectedRtkApi
