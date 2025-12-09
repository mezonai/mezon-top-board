export interface BotWizardRequest {
  botName: string
  language: string
  commands?: CommandWizardRequest[]
}

export interface CommandWizardRequest {
  command: string
  description: string
  category: string
  aliases: string[]
  className: string
}

export interface BotGeneratorResponse {
  jobId: string
  status: string
}
