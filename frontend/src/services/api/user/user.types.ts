import { HttpResponse, PaginationParams, RequestWithId } from '@app/types/API.types'
import { Role } from '@app/enums/Role.enum'
import { User } from '@app/types/User.types'

export type SearchUserResponse = Pick<User, 'id' | 'name' | 'email' | 'bio'> & { role: Role }
export type UpdateUserRequest = Partial<Pick<User, 'name' | 'bio' | 'role'>> & {
  id: string
}
export type SelfUpdateUserRequest = Partial<Pick<User, 'name' | 'bio' | 'profileImage'>>
export type GetUserDetailsResponse = Pick<User, 'id' | 'name' | 'email' | 'bio' | 'role' | 'profileImage'> & {
  deletedAt: Date | null
}
export type GetPublicProfileResponse = Pick<User, 'id' | 'name' | 'bio' | 'profileImage'>

export type UserControllerSearchUserApiArg = {
  search: string
} & PaginationParams
export type UserControllerSearchUserApiResponse = HttpResponse<SearchUserResponse[]>

export type UserControllerUpdateUserApiArg = {
  updateUserRequest: UpdateUserRequest
}
export type UserControllerUpdateUserApiResponse = unknown

export type UserControllerDeleteUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerDeleteUserApiResponse = unknown

export type UserControllerDeactivateUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerDeactivateUserApiResponse = unknown

export type UserControllerActivateUserApiArg = {
  requestWithId: RequestWithId
}
export type UserControllerActivateUserApiResponse = unknown

export type UserControllerSyncMezonApiResponse = unknown

export type UserControllerGetUserDetailsApiArg = void
export type UserControllerGetUserDetailsApiResponse = HttpResponse<GetUserDetailsResponse>

export type UserControllerGetPublicProfileApiArg = {
  userId: string
}
export type UserControllerGetPublicProfileApiResponse = HttpResponse<GetPublicProfileResponse>

export type UserControllerSelfUpdateUserApiArg = {
  selfUpdateUserRequest: SelfUpdateUserRequest
}
export type UserControllerSelfUpdateUserApiResponse = unknown
