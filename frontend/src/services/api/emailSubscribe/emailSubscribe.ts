import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { EmailSubscriptionStatus } from '@app/enums/subscribe'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    emailSubscribeControllerSendConfirmMail: build.mutation<
      EmailSubscribeControllerSendConfirmMailApiResponse,
      EmailSubscribeControllerSendConfirmMailApiArg
    >({
      query: (email) => ({ url: `/api/email-subscribe`, method: 'POST', body: email })
    }),
    emailSubscribeControllerGetAllSubscribers: build.query<
      EmailSubscribeControllerGetAllSubscribersApiResponse,
      EmailSubscribeControllerGetAllSubscribersApiArg
    >({
      query: () => ({ url: `/api/email-subscribe` })
    }),
    emailSubscribeControllerConfirmSubscribe: build.query<
      EmailSubscribeControllerConfirmSubscribeApiResponse,
      EmailSubscribeControllerConfirmSubscribeApiArg
    >({
      query: () => ({ url: `/api/email-subscribe/confirm` })
    }),
    emailSubscribeControllerUnsubscribe: build.query<
      EmailSubscribeControllerUnsubscribeApiResponse,
      EmailSubscribeControllerUnsubscribeApiArg
    >({
      query: () => ({ url: `/api/email-subscribe/unsubscribe` })
    }),
    emailSubscribeControllerSearchSubscriber: build.query<
      EmailSubscribeControllerSearchSubscriberApiResponse,
      EmailSubscribeControllerSearchSubscriberApiArg
    >({
      query: (queryArg) => ({
        url: `/api/email-subscribe/search`,
        params: {
          search: queryArg.search,
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber
        }
      })
    }),
    emailSubscribeControllerUpdateSubscriber: build.mutation<
      EmailSubscribeControllerUpdateSubscriberApiResponse,
      EmailSubscribeControllerUpdateSubscriberApiArg
    >({
      query: (queryArg) => ({ url: `/api/email-subscribe/${queryArg.id}`, method: 'PATCH', body: queryArg.updateSubscriptionRequest })
    }),
    emailSubscribeControllerReSubscribe: build.mutation<
      EmailSubscribeControllerReSubscribeApiResponse,
      EmailSubscribeControllerReSubscribeApiArg
    >({
      query: (queryArg) => ({ url: `/api/email-subscribe/resubscribe`, method: 'PATCH', body: queryArg.updateSubscriptionRequest })
    }),
    emailSubscribeControllerDelete: build.mutation<
      EmailSubscribeControllerDeleteApiResponse,
      EmailSubscribeControllerDeleteApiArg
    >({
      query: (queryArg) => ({ url: `/api/email-subscribe/${queryArg.id}`, method: 'DELETE' })
    })
  }),
  overrideExisting: false
})
export { injectedRtkApi as emailSubscribeService }
export type EmailSubscribeControllerSendConfirmMailApiResponse = HttpResponse<{ message: string }>
export type EmailSubscribeControllerSendConfirmMailApiArg = { email: string }

export type EmailSubscribeControllerGetAllSubscribersApiResponse = HttpResponse<EmailSubscriber[]>
export type EmailSubscribeControllerGetAllSubscribersApiArg = void

export type EmailSubscribeControllerConfirmSubscribeApiResponse = HttpResponse<{ message: string }>
export type EmailSubscribeControllerConfirmSubscribeApiArg = void

export type EmailSubscribeControllerUnsubscribeApiResponse = HttpResponse<{ message: string }>
export type EmailSubscribeControllerUnsubscribeApiArg = void

export type EmailSubscribeControllerSearchSubscriberApiResponse = HttpResponse<EmailSubscriber[]>
export type EmailSubscribeControllerSearchSubscriberApiArg = {
  search?: string
  pageSize: number
  pageNumber: number
}

export type EmailSubscribeControllerUpdateSubscriberApiResponse = HttpResponse<{ message: string, data: EmailSubscriber }>
export type EmailSubscribeControllerUpdateSubscriberApiArg = {
  id: string
  updateSubscriptionRequest: {
    status: EmailSubscriptionStatus
  }
}

export type EmailSubscribeControllerReSubscribeApiResponse = HttpResponse<{ message: string, data: EmailSubscriber }>
export type EmailSubscribeControllerReSubscribeApiArg = {
  updateSubscriptionRequest: {
    status: EmailSubscriptionStatus
  }
}

export type EmailSubscribeControllerDeleteApiResponse = HttpResponse<{ message: string }>
export type EmailSubscribeControllerDeleteApiArg = {
  id: string
}

export type EmailSubscriber = {
  id: string
  email: string
  status: EmailSubscriptionStatus
}
export const {
  useEmailSubscribeControllerSendConfirmMailMutation,
  useEmailSubscribeControllerGetAllSubscribersQuery,
  useLazyEmailSubscribeControllerGetAllSubscribersQuery,
  useEmailSubscribeControllerConfirmSubscribeQuery,
  useLazyEmailSubscribeControllerConfirmSubscribeQuery,
  useEmailSubscribeControllerUnsubscribeQuery,
  useLazyEmailSubscribeControllerUnsubscribeQuery,
  useEmailSubscribeControllerSearchSubscriberQuery,
  useLazyEmailSubscribeControllerSearchSubscriberQuery,
  useEmailSubscribeControllerUpdateSubscriberMutation,
  useEmailSubscribeControllerReSubscribeMutation,
  useEmailSubscribeControllerDeleteMutation
} = injectedRtkApi
