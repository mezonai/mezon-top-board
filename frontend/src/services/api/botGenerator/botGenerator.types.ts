import { WizardStatus } from '@app/enums/botWizard.enum';
import { HttpResponse } from '@app/types/API.types';
import { BotWizard } from '@app/types/botWizard.types';
import { BaseListApiArg } from '@app/types/common.types';

export type BotWizardRequest = {
  botName: string;
  language: string;
  integrations?: string[];
  events?: EventWizardRequest[];
  commands?: CommandWizardRequest[];
  templateJson: string;
};

export type CommandWizardRequest = {
  command: string;
  description: string;
  category: string;
  aliases: string[];
};

export type EventWizardRequest = {
  eventName: string;
  eventType?: string;
};

export type BotGeneratorControllerGetMyBotWizardsApiResponse = HttpResponse<BotWizard[]>;
export type BotGeneratorControllerGetMyBotWizardsApiArg = BaseListApiArg & {
  botName?: string;
  status?: WizardStatus;
};

export type BotGeneratorControllerGetBotWizardDetailApiResponse = HttpResponse<BotWizard>;
export type BotGeneratorControllerGetBotWizardDetailApiArg = {
  id: string;
};

export type BotGeneratorControllerGenerateBotTemplateApiArg = BotWizardRequest;
export type BotGeneratorControllerGenerateBotTemplateApiResponse = string;

export type BotGeneratorControllerGetIntegrationsApiArg = {
  language: string;
};
export type BotGeneratorControllerGetIntegrationsApiResponse = string[];

export type BotGeneratorControllerGetLanguagesApiResponse = string[];
export type BotGeneratorControllerGetLanguagesApiArg = void;
