import { HttpResponse } from '@app/types/API.types';
import { Subscriber } from '@app/types/mail.types'; 
import { EmailSubscriptionStatus } from '@app/enums/subscribe';
import { BasePaginationApiArg, SearchableApiArg } from '@app/types/common.types';

export type UpdateSubscriptionRequest = {
  status: EmailSubscriptionStatus;
};

export type EmailSubscribeControllerSendConfirmMailApiResponse = HttpResponse<{ message: string }>;
export type EmailSubscribeControllerSendConfirmMailApiArg = { email: string };

export type EmailSubscribeControllerGetAllSubscribersApiResponse = HttpResponse<Subscriber[]>;
export type EmailSubscribeControllerGetAllSubscribersApiArg = void;
export type EmailSubscribeControllerConfirmSubscribeApiResponse = HttpResponse<{ message: string }>;
export type EmailSubscribeControllerConfirmSubscribeApiArg = void;

export type EmailSubscribeControllerUnsubscribeApiResponse = HttpResponse<{ message: string }>;
export type EmailSubscribeControllerUnsubscribeApiArg = void;

export type EmailSubscribeControllerSearchSubscriberApiArg = BasePaginationApiArg & SearchableApiArg;
export type EmailSubscribeControllerSearchSubscriberApiResponse = HttpResponse<Subscriber[]>;

export type EmailSubscribeControllerUpdateSubscriberApiResponse = HttpResponse<{ message: string; data: Subscriber }>;
export type EmailSubscribeControllerUpdateSubscriberApiArg = {
  id: string;
  updateSubscriptionRequest: UpdateSubscriptionRequest;
};

export type EmailSubscribeControllerReSubscribeApiResponse = HttpResponse<{ message: string; data: Subscriber }>;
export type EmailSubscribeControllerReSubscribeApiArg = {
  updateSubscriptionRequest: UpdateSubscriptionRequest;
};

export type EmailSubscribeControllerDeleteApiResponse = HttpResponse<{ message: string }>;
export type EmailSubscribeControllerDeleteApiArg = {
  id: string;
};