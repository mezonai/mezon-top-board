import { HttpResponse } from '@app/types/API.types'
import { api } from '../../apiInstance'
import { RepeatUnit, SubscriptionStatus } from '@app/enums/subscribe'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    subscribeControllerSendMail: build.mutation<
      SubscribeControllerSendMailResponse,
      SubscribeControllerSendMailArg
    >({
      query: (queryArg) => ({
        url: `/api/subscribe/send-confirm-mail`,
        method: 'POST',
        body: queryArg,
      }),
    }),

    SubscribeControllerUpdateSchedule: build.mutation<
      SubscribeControllerUpdateScheduleResponse,
      SubscribeControllerUpdateScheduleArg
    >({
      query: (body) => ({
        url: `/api/subscribe/update-preferences`,
        method: 'PATCH',
        body,
      }),
    }),

    SubscribeControllerGetAllActiveSubscriber: build.query<
      SubscribeControllerGetAllSubscriberResponse,
      void
    >({
      query: () => `/api/subscribe/active-subscribers`,
    }),

    SubscribeControllerGetAllSubscriber: build.query<
      SubscribeControllerGetAllSubscriberResponse,
      void
    >({
      query: () => `/api/subscribe/all-subscribers`,
    }),

    subscribeControllerCreateSubscriber: build.mutation<
      SubscribeControllerCreateSubscriberResponse,
      SubscribeControllerCreateSubscriberArg
    >({
      query: (body) => ({
        url: `/api/subscribe/create-subscriber`,
        method: 'POST',
        body,
      }),
    }),

    subscribeControllerDeleteSubscriber: build.mutation<
      SubscribeControllerDeleteSubscriberResponse,
      SubscribeControllerDeleteSubscriberArg
    >({
      query: (id) => ({
        url: `/api/subscribe/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
})

export { injectedRtkApi as subscribeService }

export type SubscribeControllerCreateSubscriberArg = {
  email: string
  isRepeatable?: boolean
  repeatEvery?: number
  repeatUnit?: RepeatUnit
  sendTime?: string
}

export type SubscribeControllerCreateSubscriberResponse = HttpResponse<{
  message: string
  data: Subscriber
}>

export type SubscribeControllerSendMailArg = {
  email: string
}
export type SubscribeControllerSendMailResponse = HttpResponse<{
  message: string
}>

export type SubscribeControllerUpdateScheduleArg = {
  id: string
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime?: string
}

export type SubscribeControllerUpdateScheduleResponse = HttpResponse<{
  message: string
}>

export type Subscriber = {
  id: string
  email: string
  status: SubscriptionStatus
  subscribedAt: Date
  isRepeatable: boolean
  repeatEvery: number
  repeatUnit: RepeatUnit
  sendTime?: string
  unsubscribedAt?: Date
}

export type SubscribeControllerGetAllSubscriberResponse = HttpResponse<Subscriber[]>

export type SubscribeControllerDeleteSubscriberArg = string

export type SubscribeControllerDeleteSubscriberResponse = HttpResponse<{
  message: string
}>

export const {
  useSubscribeControllerSendMailMutation,
  useSubscribeControllerUpdateScheduleMutation,
  useSubscribeControllerGetAllActiveSubscriberQuery,
  useSubscribeControllerGetAllSubscriberQuery,
  useSubscribeControllerCreateSubscriberMutation,
  useSubscribeControllerDeleteSubscriberMutation,
} = injectedRtkApi
  