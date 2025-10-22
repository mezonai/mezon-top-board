import { HttpResponse } from "@app/types/API.types"
import { api } from "../../apiInstance"
import { RepeatInterval } from "@app/enums/subscribe"

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mailTemplateControllerCreateAndSendMail: build.mutation<
      MailTemplateControllerCreateMailTemplateApiResponse,
      MailTemplateControllerCreateMailTemplateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mail-template/`,
        method: "POST",
        body: queryArg.createMailRequest
      })
    }),

    mailTemplateControllerGetAllMails: build.query<
      MailTemplateControllerGetAllMailTemplatesApiResponse,
      void
    >({
      query: () => ({
        url: `/api/mail-template/`,
        method: "GET"
      })
    }),

    mailTemplateControllerSearchMailTemplates: build.query<
      MailTemplateControllerSearchMailTemplatesApiResponse,
      MailTemplateControllerSearchMailTemplatesApiArg
    >({
      query: (params) => ({
        url: `/api/mail-template/search`,
        method: 'GET',
        params,
      }),
    }),

    mailTemplateControllerUpdateMail: build.mutation<
      MailTemplateControllerUpdateMailTemplateApiResponse,
      MailTemplateControllerUpdateMailTemplateApiArg
    >({
      query: ({ id, updateMailRequest }) => ({
        url: `/api/mail-template/${id}`,
        method: "PATCH",
        body: updateMailRequest,
      }),
    }),

    mailTemplateControllerDeleteMail: build.mutation<
      MailTemplateControllerDeleteMailTemplateApiResponse,
      MailTemplateControllerDeleteMailTemplateApiArg
    >({
      query: (id) => ({
        url: `/api/mail-template/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false
})

export { injectedRtkApi as mailService }

export type MailTemplateRequest = {
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


export type MailTemplateControllerCreateMailTemplateApiResponse = HttpResponse<MailTemplate>
export type MailTemplateControllerCreateMailTemplateApiArg = {
  createMailRequest: MailTemplateRequest
}

export type MailTemplateControllerGetAllMailTemplatesApiResponse = HttpResponse<MailTemplate[]>

export type UpdateMailRequest = Partial<MailTemplateRequest>
export type MailTemplateControllerUpdateMailTemplateApiResponse = HttpResponse<MailTemplate>
export type MailTemplateControllerUpdateMailTemplateApiArg = {
  id: string
  updateMailRequest: UpdateMailRequest
}

export type MailTemplateControllerDeleteMailTemplateApiResponse = HttpResponse<{ message: string }>
export type MailTemplateControllerDeleteMailTemplateApiArg = string

export type MailTemplateControllerSearchMailTemplatesApiResponse = HttpResponse<MailTemplate[]>
export type MailTemplateControllerSearchMailTemplatesApiArg = {
  search?: string
  repeatInterval?: RepeatInterval
  pageSize: number
  pageNumber: number
  sortField?: string
  sortOrder?: string
}

export const {
  useMailTemplateControllerCreateAndSendMailMutation,
  useLazyMailTemplateControllerGetAllMailsQuery,
  useMailTemplateControllerUpdateMailMutation,
  useMailTemplateControllerDeleteMailMutation,
  useLazyMailTemplateControllerSearchMailTemplatesQuery
} = injectedRtkApi