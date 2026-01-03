import { BotWizardRequest } from "@features/bot-generator/dtos/request";

export type MarketingMailJobData = {
    to?: string;
    subject: string;
    template?: string;
    context: Record<string, string | number | boolean>
    bcc?: string[];
}

export type BotGeneratorJobData = {
  payload: BotWizardRequest;
  ownerId: string;
  botWizardId: string;
};