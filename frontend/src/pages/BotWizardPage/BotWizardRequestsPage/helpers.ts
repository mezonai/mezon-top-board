import { WizardStatus } from '@app/enums/botWizard.enum';
import { BotWizard } from '@app/types/botWizard.types';

export const getFileStatus = (botWizard: BotWizard): WizardStatus => {
    switch (botWizard.status) {
        case WizardStatus.PROCESSING:
            return WizardStatus.PROCESSING;
        case WizardStatus.COMPLETED:
            return WizardStatus.COMPLETED;
        case WizardStatus.EXPIRED:
            return WizardStatus.EXPIRED;
        default:
            return WizardStatus.PROCESSING;
    }
};

export const getStatusColor = (status: WizardStatus): string => {
    switch (status) {
        case WizardStatus.PROCESSING: return 'blue';
        case WizardStatus.COMPLETED: return 'green';
        case WizardStatus.EXPIRED: return 'red';
        default: return 'default';
    }
};