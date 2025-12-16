export type BotWizardRequest = {
    botName: string
    language: string
    integrations?: string[]
    events?: EventWizardRequest[]
    commands?: CommandWizardRequest[]
}

export type CommandWizardRequest = {
    command: string
    description: string
    category: string
    aliases: string[]
}

export type EventWizardRequest = {
    eventName: string
    eventType?: string
}

export type BotGetIntegrationsApiArg = {
  language: string;
};
export type BotGetIntegrationsApiResponse = string[];

export type BotGenerateApiResponse = string; 
export type BotGenerateApiArg = BotWizardRequest;

