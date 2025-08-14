import { HttpResponse } from '@app/types/API.types';
import { api } from '../../apiInstance';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    newsletterScheduleControllerCreate: build.mutation<HttpResponse<any>,  CreateNewsletterScheduleRequest>({
      query: (body) => ({
        url: `/api/newsletter/schedule`,
        method: 'POST',
        body,
      }),
    }),
    newsletterCampaignControllerCreate: build.mutation<NewsletterCampaignCreateResponse, CreateNewsletterCampaignRequest>({
      query: (body) => ({
        url: `/api/newsletter-campaign`,
        method: 'POST',
        body,
      }),
    }),
    newsletterCampaignControllerSearch: build.query<NewsletterCampaignSearchResponse, SearchNewsletterCampaignRequest>({
      query: (queryArg) => ({
        url: `/api/newsletter-campaign/search`,
        params: {
          pageSize: queryArg.pageSize,
          pageNumber: queryArg.pageNumber,
          sortField: queryArg.sortField,
          sortOrder: queryArg.sortOrder,
          search: queryArg.search,
        },
      }),
    }),
    newsletterCampaignControllerUpdate: build.mutation<NewsletterCampaignUpdateResponse, { id: string; body: UpdateNewsletterCampaignRequest }>({
      query: ({ id, body }) => ({
        url: `/api/newsletter-campaign/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    newsletterCampaignControllerDelete: build.mutation<HttpResponse<any>, { id: string }>({
      query: ({ id }) => ({
        url: `/api/newsletter-campaign/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as newsletterCampaignService };

// ====== Types ======

export type NewsletterCampaign = {
  id: string;
  title: string;
  headline?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNewsletterScheduleRequest = {
  mode: 'fixed' | 'interval';
  fixedHours?: number[];
  interval?: { value: number; unit: 'minutes' | 'hours' };
};
// ---- Requests ----
export type CreateNewsletterCampaignRequest = {
  title: string;
  headline?: string;
  description?: string;
};

export type UpdateNewsletterCampaignRequest = {
  title?: string;
  headline?: string;
  description?: string;
};

export type SearchNewsletterCampaignRequest = {
  pageSize: number;
  pageNumber: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
};

// ---- Responses ----
export type NewsletterCampaignCreateResponse = HttpResponse<NewsletterCampaign>;
export type NewsletterCampaignUpdateResponse = HttpResponse<NewsletterCampaign>;
export type NewsletterCampaignSearchResponse = HttpResponse<NewsletterCampaign[]>;

// ====== Hooks ======
export const {
  useNewsletterScheduleControllerCreateMutation,
  useNewsletterCampaignControllerCreateMutation,
  useNewsletterCampaignControllerSearchQuery,
  useLazyNewsletterCampaignControllerSearchQuery,
  useNewsletterCampaignControllerUpdateMutation,
  useNewsletterCampaignControllerDeleteMutation
} = injectedRtkApi;
