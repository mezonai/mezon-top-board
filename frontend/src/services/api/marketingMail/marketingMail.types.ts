import { HttpResponse } from '@app/types/API.types';
import { MailTemplate } from '@app/types/mail.types'; 
import { BasePaginationApiArg, SearchableApiArg } from '@app/types/common.types';

export type CreateMailTemplateRequest = Pick<
  MailTemplate,
  'subject' | 'content' | 'scheduledAt' | 'isRepeatable' | 'repeatInterval'
>;

export type UpdateMailTemplateRequest = Partial<CreateMailTemplateRequest>;

export type MailTemplateControllerCreateMailApiResponse = HttpResponse<MailTemplate>;
export type MailTemplateControllerCreateMailApiArg = {
  createMailTemplateRequest: CreateMailTemplateRequest;
};

export type MailTemplateControllerGetAllMailsApiResponse = HttpResponse<MailTemplate[]>;
export type MailTemplateControllerGetAllMailsApiArg = void;

export type MailTemplateControllerGetMailsSearchApiArg = BasePaginationApiArg & SearchableApiArg;
export type MailTemplateControllerGetMailsSearchApiResponse = HttpResponse<MailTemplate[]>;
export type MailTemplateControllerGetOneMailApiResponse = HttpResponse<MailTemplate>;
export type MailTemplateControllerGetOneMailApiArg = {
  id: string;
};

export type MailTemplateControllerUpdateMailApiResponse = HttpResponse<MailTemplate>;
export type MailTemplateControllerUpdateMailApiArg = {
  id: string;
  updateMailRequest: UpdateMailTemplateRequest;
};

export type MailTemplateControllerDeleteMailApiResponse = HttpResponse<{ message: string }>;
export type MailTemplateControllerDeleteMailApiArg = {
  id: string;
};