import { HttpResponse } from "@app/types/API.types"
import { api } from "../../apiInstance"
import { Subscriber } from "@app/services/api/subscribe/subscribe"

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    mailControllerCreateMail: build.mutation<
      MailControllerCreateMailApiResponse,
      MailControllerCreateMailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mail`,
        method: "POST",
        body: queryArg.createMailRequest
      })
    }),

    mailControllerCreateAndSendMail: build.mutation<
      MailControllerCreateMailApiResponse,
      MailControllerCreateMailApiArg
    >({
      query: (queryArg) => ({
        url: `/api/mail/send`,
        method: "POST",
        body: queryArg.createMailRequest
      })
    }),

    mailControllerGetAllMails: build.query<
      MailControllerGetAllMailsApiResponse,
      void
    >({
      query: () => ({
        url: `/api/mail/mails`,
        method: "GET"
      })
    }),

     mailControllerUpdateMail: build.mutation<
      MailControllerUpdateMailApiResponse,
      MailControllerUpdateMailApiArg
    >({
      query: ({ id, updateMailRequest }) => ({
        url: `/api/mail/${id}`,
        method: "PATCH",
        body: updateMailRequest,
      }),
    }),

    mailControllerDeleteMail: build.mutation<
      MailControllerDeleteMailApiResponse,
      MailControllerDeleteMailApiArg
    >({
      query: (id) => ({
        url: `/api/mail/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false
})

export { injectedRtkApi as mailService }

export type CreateMailRequest = {
  title: string
  subject: string
  content: string
  subscriberIds?: string[]
}

export type UpdateMailRequest = Partial<CreateMailRequest>

export type MailControllerCreateMailApiResponse = HttpResponse<{
  id: string
  title: string
  subject: string
  content: string
}>


export type MailControllerCreateMailApiArg = {
  createMailRequest: CreateMailRequest
}

export type Mail = {
  id: string
  title: string
  subject: string
  content: string
  subscribers: Subscriber[]
}

export type MailControllerGetAllMailsApiResponse = HttpResponse<Mail[]>

export type MailControllerUpdateMailApiResponse = HttpResponse<Mail>
export type MailControllerUpdateMailApiArg = {
  id: string
  updateMailRequest: UpdateMailRequest
}

export type MailControllerDeleteMailApiResponse = HttpResponse<null>
export type MailControllerDeleteMailApiArg = string

export const {
  useMailControllerCreateMailMutation,
  useMailControllerCreateAndSendMailMutation,
  useMailControllerGetAllMailsQuery,
  useMailControllerUpdateMailMutation,
  useMailControllerDeleteMailMutation,
} = injectedRtkApi
