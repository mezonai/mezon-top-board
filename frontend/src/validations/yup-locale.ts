import * as yup from 'yup';
import i18next from 'i18next';

export const setYupLocale = () => {
  yup.setLocale({
    mixed: {
      default: () => i18next.t('validation.invalid_type', { ns: 'validation' }),
      required: () => i18next.t('validation.required', { ns: 'validation' }),
      oneOf: ({ values }) => i18next.t('validation.invalid_value', { values, ns: 'validation' }),
    },
    string: {
      min: ({ min }) => i18next.t('validation.min_char', { count: min, ns: 'validation' }),
      max: ({ max }) => i18next.t('validation.max_char', { count: max, ns: 'validation' }),
      email: () => i18next.t('validation.invalid_email', { ns: 'validation' }),
      url: () => i18next.t('validation.invalid_url', { ns: 'validation' }),
      matches: () => i18next.t('validation.invalid_format', { ns: 'validation' }),
    },
    number: {
      min: ({ min }) => i18next.t('validation.min_value', { min, ns: 'validation' }),
      max: ({ max }) => i18next.t('validation.max_value', { max, ns: 'validation' }),
    },
    array: {
      min: ({ min }) => i18next.t('validation.at_least_one_item', { count: min, ns: 'validation' }),
    },
  });
};
