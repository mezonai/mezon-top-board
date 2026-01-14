import moment from 'moment'
import { TFunction } from 'i18next' 

export const formatDate = (date?: moment.MomentInput, format: string = 'DD/MM/YYYY HH:mm:ss') => {
   return date
    ? moment(date).local().format(format)
    : ''
}

export const formatAgo = (date?: moment.MomentInput, t?: TFunction): string => {
  if (!date) return '';

  const inputDate = moment(date);
  const now = moment();

  const diffInSeconds = now.diff(inputDate, 'seconds');
  if (diffInSeconds < 60) return t ? t('common:time.just_now') : 'Just now';

  const diffInMinutes = now.diff(inputDate, 'minutes');
  if (diffInMinutes < 60) return t ? t('common:time.minutes_ago', { count: diffInMinutes }) : `${diffInMinutes} minutes ago`;

  const diffInHours = now.diff(inputDate, 'hours');
  if (diffInHours < 24) return t ? t('common:time.hours_ago', { count: diffInHours }) : `${diffInHours} hours ago`;

  const diffInDays = now.diff(inputDate, 'days');
  if (diffInDays === 1) return t ? t('common:time.yesterday') : 'Yesterday';

  if (diffInDays < 365) return inputDate.format('D MMM HH:mm');

  return inputDate.format('D MMM YYYY HH:mm');
};