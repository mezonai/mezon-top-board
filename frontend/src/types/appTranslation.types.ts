import { AppLanguage } from '@app/enums/appLanguage.enum';

export interface AppTranslation {
  id?: string;
  language: AppLanguage;
  name: string;
  headline?: string;
  description?: string;
  appId?: string;
  appVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
}