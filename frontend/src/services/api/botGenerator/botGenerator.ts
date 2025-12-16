import { api } from '../../apiInstance';
import type { 
    BotGenerateApiResponse, 
    BotGenerateApiArg, 
    BotGetIntegrationsApiResponse,
    BotGetIntegrationsApiArg
} from './botGenerator.types';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    botGenerate: build.mutation<BotGenerateApiResponse, BotGenerateApiArg>({
      query: (queryArg) => ({
        url: `/api/bot-generator`,
        method: 'POST',
        body: queryArg,
        responseHandler: (response) => response.text(),
      })
    }),

    botGetIntegrations: build.query<BotGetIntegrationsApiResponse, BotGetIntegrationsApiArg>({
      query: (queryArg) => ({
        url: `/api/bot-generator/integrations/${queryArg.language}`,
        method: 'GET'
      })
    }),
  }),
  overrideExisting: false
});

export { injectedRtkApi as botGeneratorService };

export const {
  useBotGenerateMutation,
  useBotGetIntegrationsQuery,
  useLazyBotGetIntegrationsQuery
} = injectedRtkApi;