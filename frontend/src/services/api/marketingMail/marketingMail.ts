import { api } from '../../apiInstance'
import type {
  MailTemplateControllerCreateMailApiResponse,
  MailTemplateControllerCreateMailApiArg,
  MailTemplateControllerGetAllMailsApiResponse,
  MailTemplateControllerGetAllMailsApiArg,
  MailTemplateControllerGetMailsSearchApiResponse,
  MailTemplateControllerGetMailsSearchApiArg,
  MailTemplateControllerGetOneMailApiResponse,
  MailTemplateControllerGetOneMailApiArg,
  MailTemplateControllerUpdateMailApiResponse,
  MailTemplateControllerUpdateMailApiArg,
  MailTemplateControllerDeleteMailApiResponse,
  MailTemplateControllerDeleteMailApiArg
} from './marketingMail.types'

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