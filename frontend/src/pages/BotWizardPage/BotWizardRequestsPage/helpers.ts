import { WizardStatus } from '@app/enums/botWizard.enum';
import { TempFile } from '@app/types/tempFile.types';
import dayjs from 'dayjs';

export const getFileStatus = (file: TempFile): WizardStatus => {
    const now = dayjs();
    const expiredDate = dayjs(file.expiredAt);
    
    if (now.isAfter(expiredDate)) {
        return WizardStatus.Expired;
    }
    return WizardStatus.Completed;
};

export const getStatusColor = (status: WizardStatus): string => {
    switch (status) {
        case WizardStatus.Processing: return 'blue';
        case WizardStatus.Completed: return 'green';
        case WizardStatus.Expired: return 'red';
        default: return 'default';
    }
};