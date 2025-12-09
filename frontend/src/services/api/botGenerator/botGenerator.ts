import { BotGeneratorResponse, BotWizardRequest } from '@app/services/api/botGenerator/bot-generator.types'
import { api } from '../../apiInstance'

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    botGeneratorCreateJob: build.mutation<
      BotGeneratorResponse,
      BotWizardRequest
    >({
      query: (payload) => ({
        url: `/api/bot-generator`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
})

export const botGeneratorService = injectedRtkApi
export const {
  useBotGeneratorCreateJobMutation,
} = injectedRtkApi
