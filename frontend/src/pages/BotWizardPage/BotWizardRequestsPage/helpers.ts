import { WizardStatus } from '@app/enums/botWizard.enum';
import { BotWizard } from '@app/types/botWizard.types';

export const getStatusColor = (status: WizardStatus): string => {
    switch (status) {
        case WizardStatus.PROCESSING: return 'blue';
        case WizardStatus.COMPLETED: return 'green';
        case WizardStatus.EXPIRED: return 'red';
        default: return 'default';
    }
};