import * as yup from 'yup'

export const getProfileSettingSchema = yup.object({
  name: yup.string().required('validation.name_required').min(3).max(50),
  bio: yup.string().optional()
})