import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { EmailSubscriptionStatus } from '@app/enums/subscribe'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    emailSubscribeControllerSendSubscribeMail: build.mutation<
      EmailSubscribeControllerSendSubscribeMailResponse,
      EmailSubscribeControllerSendSubscribeMailArg
    >({
      query: (queryArg) => ({
        url: `/api/email-subscribe/`,
        method: 'POST',
        body: queryArg,
      }),
    }),

    emailSubscribeControllerConfirm: build.query<
      EmailSubscribeControllerConfirmResponse,
      EmailSubscribeControllerConfirmArg
    >({
      query: (token) => ({
        url: `/api/email-subscribe/confirm/${token}`,
        method: 'GET',
      }),
    }),

    emailSubscriberControllerSearchEmailSubscribers: build.query<
      EmailSubscriberControllerSearchEmailSubscribersApiResponse,
      EmailSubscriberControllerSearchEmailSubscribersApiArg
    >({
      query: (params) => ({
        url: `/api/email-subscribe/search`,
        method: 'GET',
        params,
      }),
    }),

    emailSubscribeControllerUpdateSubscriber: build.mutation<
      EmailSubscribeControllerUpdateSubscriberResponse,
      EmailSubscribeControllerUpdateSubscriberArg
    >({
      query: ({ id, updateSubscriptionRequest }) => ({
        url: `/api/email-subscribe/${id}`,
        method: 'PATCH',
        body: updateSubscriptionRequest,
      }),
    }),

    emailSubscribeControllerGetAllSubscriber: build.query<
      EmailSubscribeControllerGetAllSubscriberResponse,
      void
    >({
      query: () => ({ url: `/api/email-subscribe/` }),
    }),

    emailSubscribeControllerDeleteSubscriber: build.mutation<
      EmailSubscribeControllerDeleteSubscriberResponse,
      EmailSubscribeControllerDeleteSubscriberArg
    >({
      query: (id) => ({
        url: `/api/email-subscribe/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
})

export { injectedRtkApi as subscribeService }

export type EmailSubscriber = {
  id: string
  email: string
  status: EmailSubscriptionStatus
}

export type EmailSubscribeControllerSendSubscribeMailArg = { email: string }
export type EmailSubscribeControllerSendSubscribeMailResponse = HttpResponse<{ message: string }>

export type EmailSubscribeControllerConfirmArg = string
export type EmailSubscribeControllerConfirmResponse = HttpResponse<{ message: string }>

export type EmailSubscribeControllerUpdateSubscriberArg = {
  id: string
  updateSubscriptionRequest: {
    status?: EmailSubscriptionStatus
  }
}
export type EmailSubscribeControllerUpdateSubscriberResponse = HttpResponse<{ message: string }>

export type EmailSubscriberControllerSearchEmailSubscribersApiResponse = HttpResponse<EmailSubscriber[]>
export type EmailSubscriberControllerSearchEmailSubscribersApiArg = {
  search?: string
  status?: EmailSubscriptionStatus
  pageSize: number
  pageNumber: number
  sortField?: string
  sortOrder?: string
}

export type EmailSubscribeControllerDeleteSubscriberArg = string
export type EmailSubscribeControllerDeleteSubscriberResponse = HttpResponse<{ message: string }>

export type EmailSubscribeControllerGetAllSubscriberResponse = HttpResponse<EmailSubscriber[]>

export const {
  useEmailSubscribeControllerSendSubscribeMailMutation,
  useEmailSubscribeControllerConfirmQuery,
  useEmailSubscribeControllerUpdateSubscriberMutation,
  useLazyEmailSubscribeControllerGetAllSubscriberQuery,
  useEmailSubscribeControllerGetAllSubscriberQuery,
  useEmailSubscribeControllerDeleteSubscriberMutation,
  useLazyEmailSubscriberControllerSearchEmailSubscribersQuery,
} = injectedRtkApi