import { HttpResponse, RequestWithId } from '@app/types/API.types';
import { User } from '@app/types/user.types';
import { Role } from '@app/enums/role.enum';
import { BaseListApiArg, SearchableApiArg } from '@app/types/common.types';

export type SearchUserResponse = Pick<User, 'id' | 'name' | 'email' | 'bio' | 'role'>;
export type GetUserDetailsResponse = Pick<
  User,
  'id' | 'name' | 'email' | 'bio' | 'role' | 'profileImage' | 'deletedAt'
>;
export type GetPublicProfileResponse = Pick<User, 'id' | 'email' | 'name' | 'bio' | 'profileImage'>;

export type UpdateUserRequest = {
  id: string;
  name?: string;
  bio?: string;
  role?: Role;
};

export type SelfUpdateUserRequest = {
  name?: string;
  bio?: string;
  profileImage?: string;
};

export type UserControllerSearchUserApiArg = BaseListApiArg & SearchableApiArg;
export type UserControllerSearchUserApiResponse = HttpResponse<SearchUserResponse[]>;

export type UserControllerUpdateUserApiResponse = unknown; // TODO: define proper response type
export type UserControllerUpdateUserApiArg = {
  updateUserRequest: UpdateUserRequest;
};

export type UserControllerDeleteUserApiResponse = unknown; // TODO: define proper response type
export type UserControllerDeleteUserApiArg = { requestWithId: RequestWithId };

export type UserControllerDeactivateUserApiResponse = unknown; // TODO: define proper response type
export type UserControllerDeactivateUserApiArg = { requestWithId: RequestWithId };

export type UserControllerActivateUserApiResponse = unknown; // TODO: define proper response type
export type UserControllerActivateUserApiArg = { requestWithId: RequestWithId };

export type UserControllerGetUserDetailsApiResponse = HttpResponse<GetUserDetailsResponse>;
export type UserControllerGetUserDetailsApiArg = void;

export type UserControllerGetPublicProfileApiResponse = HttpResponse<GetPublicProfileResponse>;
export type UserControllerGetPublicProfileApiArg = { userId: string };
export type UserControllerSelfUpdateUserApiResponse = unknown; // TODO: define proper response type
export type UserControllerSelfUpdateUserApiArg = {
  selfUpdateUserRequest: SelfUpdateUserRequest;
};

export type UserControllerSyncMezonApiResponse = unknown; // TODO: define proper response type
export type UserControllerSyncMezonApiArg = void;