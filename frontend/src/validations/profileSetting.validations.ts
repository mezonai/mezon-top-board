import * as yup from 'yup'

export const PROFILE_SETTING_SCHEMA = yup.object({
  name: yup.string().required("Name is required").min(3, "Minimum 3 characters").max(50, "Maximum 50 characters"),
  bio: yup.string().optional()
})