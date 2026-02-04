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

export const useAppTranslation = (data?: TranslatableData | null) => {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const list = data?.appTranslations;
    const lang = i18n.language?.split('-')[0] as AppLanguage; 

    const t = list?.find(x => x.language === lang) 
           || list?.find(x => x.language === data?.defaultLanguage) 
           || list?.[0];

    return {
      name: t?.name ?? '',
      headline: t?.headline ?? '',
      description: t?.description ?? '',
      currentLang: t?.language
    };
  }, [data, i18n.language]);
};