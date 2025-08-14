import { HttpResponse } from '@app/types/API.types';
import { api } from '../../apiInstance';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    subscriberControllerSearch: build.query<SubscriberSearchResponse, SubscriberSearchRequest>({
      query: (queryArg) => ({
        url: `/api/subscriber`,
        params: {
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder,
          search: queryArg.search,
        },
      }),
    }),
    subscriberControllerSubscribe: build.mutation<SubscribeResponse, SubscribeRequest>({
      query: (body) => ({
        url: `/api/subscriber/subscribe`,
        method: 'POST',
        body,
      }),
    }),
    subscriberControllerUnsubscribe: build.mutation<UnsubscribeResponse, UnsubscribeRequest>({
      query: (body) => ({
        url: `/api/subscriber/unsubscribe`,
        method: 'POST',
        body,
      }),
    }),
    subscriberControllerConfirmEmail: build.mutation<HttpResponse<any>, { token: string }>({
      query: (body) => ({
        url: `/api/subscriber/confirm-email`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as subscriberService };
export type SubscribeRequest = {
  email: string;
};

export type SubscribeResponse = HttpResponse<{
  email: string;
}>;

export type UnsubscribeRequest = {
  email: string;
};

export type UnsubscribeResponse = HttpResponse<{
  email: string;
}>;

export type SubscriberSearchRequest = {
  pageSize: number;
  pageNumber: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriberSearchResponse = HttpResponse<Subscriber[]>;
export const {
  useSubscriberControllerSearchQuery,
  useLazySubscriberControllerSearchQuery,
  useSubscriberControllerSubscribeMutation,
  useSubscriberControllerUnsubscribeMutation,
  useSubscriberControllerConfirmEmailMutation
} = injectedRtkApi;
