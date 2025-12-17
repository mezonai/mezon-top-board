import { api } from '../../apiInstance';
import type {
  BotGeneratorControllerGetBotWizardDetailApiResponse,
  BotGeneratorControllerGetBotWizardDetailApiArg,
  BotGeneratorControllerGenerateBotTemplateApiArg,
  BotGeneratorControllerGenerateBotTemplateApiResponse,
  BotGeneratorControllerSearchBotWizardsApiResponse,
  BotGeneratorControllerSearchBotWizardsApiArg,
  BotGeneratorControllerGetMyBotWizardsApiResponse,
  BotGeneratorControllerGetMyBotWizardsApiArg,
  BotGeneratorControllerGetLanguagesApiResponse,
  BotGeneratorControllerGetIntegrationsApiResponse,
  BotGeneratorControllerGetIntegrationsApiArg,
  BotGeneratorControllerGetLanguagesApiArg,
} from './botGenerator.types';

export const botGeneratorService = api.injectEndpoints({
  endpoints: (build) => ({
    botGeneratorControllerGenerateBotTemplate: build.mutation<
      BotGeneratorControllerGenerateBotTemplateApiResponse,
      BotGeneratorControllerGenerateBotTemplateApiArg>({
        query: (body) => ({
          url: `/api/bot-generator`,
          method: 'POST',
          body,
          responseHandler: (response) => response.text(),
        }),
      }),

    botGeneratorControllerGetBotWizardDetail: build.query<
      BotGeneratorControllerGetBotWizardDetailApiResponse, BotGeneratorControllerGetBotWizardDetailApiArg>({
        query: (id) => ({
          url: `/api/bot-generator/${id}`,
          method: 'GET',
        }),
      }),

    botGeneratorControllerSearchBotWizards: build.query<
      BotGeneratorControllerSearchBotWizardsApiResponse,
      BotGeneratorControllerSearchBotWizardsApiArg>({
        query: (params) => ({
          url: `/api/bot-generator/search`,
          method: 'GET',
          params,
        }),
      }),

    botGeneratorControllerGetMyBotWizards: build.query<
      BotGeneratorControllerGetMyBotWizardsApiResponse, BotGeneratorControllerGetMyBotWizardsApiArg>({
        query: (params) => ({
          url: `/api/bot-generator/my-wizards`,
          method: 'GET',
          params,
        }),
      }),

    botGeneratorControllerGetIntegrations: build.query<
      BotGeneratorControllerGetIntegrationsApiResponse,
      BotGeneratorControllerGetIntegrationsApiArg
    >({
      query: ({ language }) => ({
        url: `/api/bot-generator/integrations/${language}`,
        method: 'GET',
      }),
    }),

    botGeneratorControllerGetLanguages: build.query<
      BotGeneratorControllerGetLanguagesApiResponse,
      BotGeneratorControllerGetLanguagesApiArg
    >({
      query: () => ({
        url: `/api/bot-generator/languages`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useBotGeneratorControllerGenerateBotTemplateMutation,
  useBotGeneratorControllerGetBotWizardDetailQuery,
  useLazyBotGeneratorControllerGetBotWizardDetailQuery,
  useBotGeneratorControllerSearchBotWizardsQuery,
  useLazyBotGeneratorControllerSearchBotWizardsQuery,
  useBotGeneratorControllerGetMyBotWizardsQuery,
  useLazyBotGeneratorControllerGetMyBotWizardsQuery,
  useBotGeneratorControllerGetIntegrationsQuery,
  useLazyBotGeneratorControllerGetIntegrationsQuery,
  useBotGeneratorControllerGetLanguagesQuery,
  useLazyBotGeneratorControllerGetLanguagesQuery,
} = botGeneratorService;
