import { api } from '../../apiInstance';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    botGeneratorGenerate: build.mutation<
      Blob,
      any
    >({
      query: ({ payload }) => ({
        url: `/api/bot-generator/generate`,
        method: 'POST',
        body: payload,
        responseHandler: async (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as botGeneratorService }
export const { useBotGeneratorGenerateMutation } = injectedRtkApi;
