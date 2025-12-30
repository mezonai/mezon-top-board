import * as yup from 'yup'

export const getProfileSettingSchema = (t: any) => yup.object({
  name: yup.string().required(t('validation.name_required')).min(3, t('validation.min_char', { count: 3 })).max(50, t('validation.max_char', { count: 50 })),
  bio: yup.string().optional()
})