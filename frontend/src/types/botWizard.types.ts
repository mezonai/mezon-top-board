import { WizardStatus } from "@app/enums/botWizard.enum"
import { TempFile } from "@app/types/tempFile.types"

export type BotWizard = {
    id: string
    botName: string
    language: string
    status: WizardStatus
    templateJson: string
    tempFile: TempFile
}