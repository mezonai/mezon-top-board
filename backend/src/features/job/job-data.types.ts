import { MailTemplate } from "@domain/entities/schema/mailTemplate.entity";
import { BotWizardRequest } from "@features/bot-generator/dtos/request";

export type SendEmailJobData = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string | number | boolean>
};

export type MarketingCampaignJobData = {
  mailTemplate: MailTemplate;
};

export type BotGeneratorJobData = {
  payload: BotWizardRequest;
  ownerId: string;
  botWizardId: string;
};