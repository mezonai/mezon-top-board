import { HttpResponse, RequestWithId } from '@app/types/API.types';
import { User } from '@app/types/user.types';
import { App, AppVersion } from '@app/types';
import { AppReviewHistory } from '@app/types/appReviewHistory.types';
import { BaseListApiArg, SearchableApiArg } from '@app/types/common.types';

type ReviewerDto = Pick<User, 'id' | 'name' | 'email' | 'role'>;
type AppInfoDto = Pick<
  App,
  'id' | 'type' | 'mezonAppId' | 'featuredImage' | 'appTranslations' | 'defaultLanguage'
>;
type AppVersionDto = Pick<AppVersion, 'version' | 'changelog'>;

export type ReviewHistoryResponse = Pick<AppReviewHistory, 'id' | 'remark' | 'reviewedAt' | 'isApproved'> & {
  reviewer: ReviewerDto;
  app: AppInfoDto;
  appVersion: AppVersionDto;
};

export type ReviewHistoryControllerCreateAppReviewRequest = Pick<AppReviewHistory, 'appId' | 'isApproved' | 'remark'>;
export type ReviewHistoryControllerUpdateAppReviewRequest = Pick<AppReviewHistory, 'id' | 'remark'>;

export type ReviewHistoryControllerSearchAppReviewsApiArg = BaseListApiArg &
  SearchableApiArg & {
    appId?: string;
  };
export type ReviewHistoryControllerSearchAppReviewsApiResponse = HttpResponse<ReviewHistoryResponse[]>;
export type ReviewHistoryControllerCreateAppReviewApiResponse = unknown; // TODO: define proper response type
export type ReviewHistoryControllerCreateAppReviewApiArg = {
  createAppReviewRequest: ReviewHistoryControllerCreateAppReviewRequest;
};

export type ReviewHistoryControllerUpdateAppReviewApiResponse = unknown; // TODO: define proper response type
export type ReviewHistoryControllerUpdateAppReviewApiArg = {
  updateAppReviewRequest: ReviewHistoryControllerUpdateAppReviewRequest;
};

export type ReviewHistoryControllerDeleteAppReviewApiResponse = unknown; // TODO: define proper response type
export type ReviewHistoryControllerDeleteAppReviewApiArg = {
  requestWithId: RequestWithId;
};