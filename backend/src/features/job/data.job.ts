import { BotWizardRequest } from "@features/bot-generator/dtos/request";

export type JobData = {
    to: string | string[];
    subject: string;
    template?: string;
    context: Record<string, string | number | boolean>
}

export type BotGeneratorJobData = {
  tempFileId: string;
  payload: BotWizardRequest;
};