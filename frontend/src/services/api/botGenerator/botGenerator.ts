import { api } from '../../apiInstance';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({

    botGeneratorCreateJob: build.mutation<any, any>({
      query: (payload) => ({
        url: `/api/bot-generator`,
        method: 'POST',
        body: payload,
      }),
    }),

    botGeneratorGetList: build.query<any[], void>({
      query: () => ({
        url: `/api/bot-generator`,
        method: 'GET',
      }),
    }),

    botGeneratorGetFile: build.mutation<Blob, string>({
      query: (id) => ({
        url: `/api/bot-generator/${id}`,
        method: 'GET',
        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),

  overrideExisting: false,
});

export { injectedRtkApi as botGeneratorService };

export const {
  useBotGeneratorCreateJobMutation,
  useBotGeneratorGetListQuery,
  useBotGeneratorGetFileMutation,
} = injectedRtkApi;
