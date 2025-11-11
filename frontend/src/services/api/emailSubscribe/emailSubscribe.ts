import { api } from '../../apiInstance'
import type {
  EmailSubscribeControllerSendConfirmMailApiResponse,
  EmailSubscribeControllerSendConfirmMailApiArg,
  EmailSubscribeControllerGetAllSubscribersApiResponse,
  EmailSubscribeControllerGetAllSubscribersApiArg,
  EmailSubscribeControllerConfirmSubscribeApiResponse,
  EmailSubscribeControllerConfirmSubscribeApiArg,
  EmailSubscribeControllerUnsubscribeApiResponse,
  EmailSubscribeControllerUnsubscribeApiArg,
  EmailSubscribeControllerSearchSubscriberApiResponse,
  EmailSubscribeControllerSearchSubscriberApiArg,
  EmailSubscribeControllerUpdateSubscriberApiResponse,
  EmailSubscribeControllerUpdateSubscriberApiArg,
  EmailSubscribeControllerReSubscribeApiResponse,
  EmailSubscribeControllerReSubscribeApiArg,
  EmailSubscribeControllerDeleteApiResponse,
  EmailSubscribeControllerDeleteApiArg
} from './emailSubscribe.types'

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