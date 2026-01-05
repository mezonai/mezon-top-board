import { BotWizardRequest } from "@features/bot-generator/dtos/request";

export type SendEmailJobData = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string | number | boolean>
  campaignId?: string;
};

export type MarketingCampaignJobData = {
  mailTemplateId: string;
  campaignId: string;
};

export type BotGeneratorJobData = {
  payload: BotWizardRequest;
  ownerId: string;
  botWizardId: string;
};