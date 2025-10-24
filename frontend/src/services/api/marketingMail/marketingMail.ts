import { RepeatInterval } from '@app/enums/subscribe'
import { api } from '../../apiInstance'
import { HttpResponse } from '@app/types/API.types'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mailTemplateControllerCreateMail: build.mutation<
      MailTemplateControllerCreateMailApiResponse,
      MailTemplateControllerCreateMailApiArg
    >({
      query: (queryArg) => ({ url: `/api/mail-template`, method: 'POST', body: queryArg.createMailTemplateRequest })
    }),
    mailTemplateControllerGetAllMails: build.query<
      MailTemplateControllerGetAllMailsApiResponse,
      MailTemplateControllerGetAllMailsApiArg
    >({
      query: () => ({ url: `/api/mail-template` })
    }),
    mailTemplateControllerGetMailsSearch: build.query<
      MailTemplateControllerGetMailsSearchApiResponse,
      MailTemplateControllerGetMailsSearchApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mail-template/search`,
        params: {
          search: queryArg.search,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
        }
      })
    }),
    mailTemplateControllerGetOneMail: build.query<
      MailTemplateControllerGetOneMailApiResponse,
      MailTemplateControllerGetOneMailApiArg
    >({
      query: (queryArg) => ({ url: `/api/mail-template/${queryArg.id}` })
    }),
    mailTemplateControllerUpdateMail: build.mutation<
      MailTemplateControllerUpdateMailApiResponse,
      MailTemplateControllerUpdateMailApiArg
    >({
      query: (queryArg) => ({ url: `/api/mail-template/${queryArg.id}`, method: 'PATCH', body: queryArg.updateMailRequest })
    }),
    mailTemplateControllerDeleteMail: build.mutation<
      MailTemplateControllerDeleteMailApiResponse,
      MailTemplateControllerDeleteMailApiArg
    >({
      query: (queryArg) => ({ url: `/api/mail-template/${queryArg.id}`, method: 'DELETE' })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as marketingMailService }
export type MailTemplateControllerCreateMailApiResponse = HttpResponse<MailTemplate>
export type MailTemplateControllerCreateMailApiArg = {
  createMailTemplateRequest: CreateMailTemplateRequest
}

export type MailTemplateControllerGetAllMailsApiResponse = HttpResponse<MailTemplate[]>
export type MailTemplateControllerGetAllMailsApiArg = void

export type MailTemplateControllerGetMailsSearchApiResponse = HttpResponse<MailTemplate[]>
export type MailTemplateControllerGetMailsSearchApiArg = {
  search?: string
  pageSize: number
  pageNumber: number
}
export type MailTemplateControllerGetOneMailApiResponse = HttpResponse<MailTemplate>
export type MailTemplateControllerGetOneMailApiArg = {
  id: string
}
export type MailTemplateControllerUpdateMailApiResponse = HttpResponse<MailTemplate>
export type MailTemplateControllerUpdateMailApiArg = {
  id: string
  updateMailRequest: Partial<CreateMailTemplateRequest>
}
export type MailTemplateControllerDeleteMailApiResponse = HttpResponse<{ message: string }>
export type MailTemplateControllerDeleteMailApiArg = {
  id: string
}
export type CreateMailTemplateRequest = {
  subject: string
  content: string
  scheduledAt: Date
  isRepeatable: boolean
  repeatInterval?: RepeatInterval
}

export type MailTemplate = {
  id: string
  subject: string
  content: string
  scheduledAt: Date
  isRepeatable: boolean
  repeatInterval?: RepeatInterval
}
export const {
  useMailTemplateControllerCreateMailMutation,
  useMailTemplateControllerGetAllMailsQuery,
  useLazyMailTemplateControllerGetAllMailsQuery,
  useMailTemplateControllerGetMailsSearchQuery,
  useLazyMailTemplateControllerGetMailsSearchQuery,
  useMailTemplateControllerGetOneMailQuery,
  useLazyMailTemplateControllerGetOneMailQuery,
  useMailTemplateControllerUpdateMailMutation,
  useMailTemplateControllerDeleteMailMutation
} = injectedRtkApi
