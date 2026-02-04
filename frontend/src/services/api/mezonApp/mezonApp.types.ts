import { HttpResponse } from '@app/types/API.types';
import { App, AppVersion } from '@app/types';
import { User } from '@app/types/user.types';
import { Tag } from '@app/types/tag.types';
import { Link } from '@app/types/link.types';
import { SearchMezonAppRequest } from '@app/types/common.types';
import { RequestWithId } from '@app/types/API.types';
import { LinkTypeResponse } from '../linkType/linkType.types';
import { SocialLink } from '@app/types/link.types';
import { AppTranslation } from '@app/types/appTranslation.types';

export type OwnerInMezonAppDetailResponse = Pick<User, 'id' | 'name' | 'profileImage'>;
export type TagInMezonAppDetailResponse = Pick<Tag, 'id' | 'name' | 'color'>;
export type SocialLinkInMezonAppDetailResponse = Pick<Link, 'id' | 'url' | 'linkTypeId'> & {
  type: LinkTypeResponse;
};

export type AppTranslationDto = Pick<
  AppTranslation,
  | 'id'
  | 'language'
  | 'name'
  | 'headline'
  | 'description'
>;

export type AppVersionDetailsDto = Pick<
  AppVersion,
  | 'id'
  | 'version'
  | 'status'
  | 'changelog'
  | 'isAutoPublished'
  | 'prefix'
  | 'featuredImage'
  | 'supportUrl'
  | 'pricingTag'
  | 'price'
  | 'defaultLanguage'
  | 'createdAt'
  | 'updatedAt'
  | 'appId'
> & {
  tags: TagInMezonAppDetailResponse[];
  socialLinks: SocialLinkInMezonAppDetailResponse[];
  appTranslations: AppTranslationDto[];
};

export type GetMezonAppDetailsResponse = Pick<
  App,
  | 'id'
  | 'currentVersion'
  | 'currentVersionChangelog'
  | 'currentVersionUpdatedAt'
  | 'prefix'
  | 'featuredImage'
  | 'status'
  | 'pricingTag'
  | 'price'
  | 'type'
  | 'mezonAppId'
  | 'supportUrl'
  | 'hasNewUpdate'
  | 'defaultLanguage'
  | 'createdAt'
  | 'updatedAt'
  | 'changelog'
> & {
  owner: OwnerInMezonAppDetailResponse;
  tags: TagInMezonAppDetailResponse[];
  socialLinks: SocialLinkInMezonAppDetailResponse[];
  isFavorited: boolean;
  rateScore: number;
  versions: AppVersionDetailsDto[];
  appTranslations: AppTranslationDto[];
};

export type GetRelatedMezonAppResponse = Pick<App, 'id' | 'status' | 'featuredImage' | 'defaultLanguage'> & {
  rateScore: number;
  appTranslations: AppTranslationDto[];
};

export type CreateMezonAppRequest = Pick<
  App,
  | 'mezonAppId'
  | 'type'
  | 'isAutoPublished'
  | 'supportUrl'
  | 'pricingTag'
  | 'price'
  | 'defaultLanguage'
> & {
  prefix?: string;
  featuredImage?: string;
  changelog?: string;
  tagIds: string[];
  socialLinks?: SocialLink[];
  appTranslations: AppTranslationDto[];
};

export type UpdateMezonAppRequest = Partial<CreateMezonAppRequest> & {
  id: string;
};

export type MezonAppControllerListAdminMezonAppApiArg = SearchMezonAppRequest;
export type MezonAppControllerListAdminMezonAppApiResponse = unknown; // TODO: define type

export type MezonAppControllerGetMyAppApiArg = SearchMezonAppRequest;
export type MezonAppControllerGetMyAppApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>;

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

export type MezonAppControllerSearchMezonAppApiArg = SearchMezonAppRequest;
export type MezonAppControllerSearchMezonAppApiResponse = HttpResponse<GetMezonAppDetailsResponse[]>;

export type MezonAppControllerGetRandomAppApiResponse = HttpResponse<{ id: string }>;
export type MezonAppControllerGetRandomAppApiArg = void;