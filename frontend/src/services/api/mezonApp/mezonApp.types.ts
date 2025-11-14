import { HttpResponse } from '@app/types/API.types';
import { App, AppVersion } from '@app/types';
import { User } from '@app/types/user.types';
import { Tag } from '@app/types/tag.types';
import { Link } from '@app/types/link.types';
import { MezonAppType } from '@app/enums/mezonAppType.enum';
import { BaseListApiArg, SearchableApiArg } from '@app/types/common.types';
import { RequestWithId } from '@app/types/API.types';
import { LinkTypeResponse } from '../linkType/linkType.types';
import { SocialLink } from '@app/types/link.types';

export type OwnerInMezonAppDetailResponse = Pick<User, 'id' | 'name' | 'profileImage'>;
export type TagInMezonAppDetailResponse = Pick<Tag, 'id' | 'name'>;
export type SocialLinkInMezonAppDetailResponse = Pick<Link, 'id' | 'url' | 'linkTypeId'> & {
  type: LinkTypeResponse;
};

export type AppVersionDetailsDto = Pick<
  AppVersion,
  | 'id'
  | 'name'
  | 'version'
  | 'status'
  | 'changelog'
  | 'isAutoPublished'
  | 'headline'
  | 'description'
  | 'prefix'
  | 'featuredImage'
  | 'supportUrl'
  | 'remark'
  | 'pricingTag'
  | 'price'
  | 'createdAt'
  | 'updatedAt'
  | 'appId'
> & {
  tags: TagInMezonAppDetailResponse[];
  socialLinks: SocialLinkInMezonAppDetailResponse[];
};

export type GetMezonAppDetailsResponse = Pick<
  App,
  | 'id'
  | 'currentVersion'
  | 'name'
  | 'description'
  | 'prefix'
  | 'headline'
  | 'featuredImage'
  | 'status'
  | 'pricingTag'
  | 'price'
  | 'type'
  | 'mezonAppId'
  | 'supportUrl'
  | 'hasNewUpdate'
  | 'createdAt'
  | 'updatedAt'
> & {
  owner: OwnerInMezonAppDetailResponse;
  tags: TagInMezonAppDetailResponse[];
  socialLinks: SocialLinkInMezonAppDetailResponse[];
  rateScore: number;
  versions: AppVersionDetailsDto[];
};

export type GetRelatedMezonAppResponse = Pick<App, 'id' | 'name' | 'status' | 'featuredImage'> & {
  rateScore: number;
};

export type CreateMezonAppRequest = Pick<
  App,
  | 'mezonAppId'
  | 'type'
  | 'name'
  | 'isAutoPublished'
  | 'headline'
  | 'description'
  | 'supportUrl'
  | 'pricingTag'
  | 'price'
> & {
  prefix?: string;
  featuredImage?: string;
  remark?: string;
  tagIds: string[];
  socialLinks?: SocialLink[];
};

export type UpdateMezonAppRequest = Partial<CreateMezonAppRequest> & {
  id: string;
};

export type MezonAppControllerListAdminMezonAppApiArg = BaseListApiArg & SearchableApiArg;
export type MezonAppControllerListAdminMezonAppApiResponse = unknown; // TODO: define type

export type MezonAppControllerGetMyAppApiArg = BaseListApiArg & SearchableApiArg & {
  tags?: string[];
  type?: MezonAppType;
};
export type MezonAppControllerGetMyAppApiResponse = unknown; // TODO: define type
export type MezonAppControllerGetMezonAppDetailApiArg = { id: string };
export type MezonAppControllerGetMezonAppDetailApiResponse = HttpResponse<GetMezonAppDetailsResponse>;

export type MezonAppControllerDeleteMezonAppApiArg = { requestWithId: RequestWithId };
export type MezonAppControllerDeleteMezonAppApiResponse = HttpResponse<any>;

export type MezonAppControllerCreateMezonAppApiArg = { createMezonAppRequest: CreateMezonAppRequest };
export type MezonAppControllerCreateMezonAppApiResponse = App; 

export type MezonAppControllerUpdateMezonAppApiArg = { updateMezonAppRequest: UpdateMezonAppRequest };
export type MezonAppControllerUpdateMezonAppApiResponse = App; 

export type MezonAppControllerGetRelatedMezonAppApiArg = { id: string };
export type MezonAppControllerGetRelatedMezonAppApiResponse = HttpResponse<GetRelatedMezonAppResponse[]>;

export type MezonAppControllerSearchMezonAppApiArg = BaseListApiArg &
  SearchableApiArg & {
    ownerId?: string;
    type?: MezonAppType;
    tags?: string[];
  };
export type MezonAppControllerSearchMezonAppApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>;