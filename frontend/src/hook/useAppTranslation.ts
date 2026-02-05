import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLanguage } from '@app/enums/appLanguage.enum';

export interface TranslatableData {
  defaultLanguage?: AppLanguage;
  appTranslations?: {
    language: AppLanguage;
    name: string;
    headline?: string;
    description?: string;
  }[];
}

export const getAppTranslation = (data?: TranslatableData | null, language?: string) => {
  const list = data?.appTranslations;
  const lang = language?.split('-')[0] as AppLanguage; 

  const t = list?.find(x => x.language === lang) 
         || list?.find(x => x.language === data?.defaultLanguage) 
         || list?.[0];

  return {
    name: t?.name ?? '',
    headline: t?.headline ?? '',
    description: t?.description ?? '',
    currentLang: t?.language
  };
};

export const useAppTranslation = (data?: TranslatableData | null, targetLanguage?: AppLanguage) => {
  const { i18n } = useTranslation();
  const langToUse = targetLanguage || i18n.language;

  return useMemo(() => getAppTranslation(data, langToUse), [data, langToUse]);
};