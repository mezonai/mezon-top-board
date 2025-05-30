import * as yup from 'yup'
import { LinkTypeFormValues } from '@app/pages/AdminPage/AdminManageLinkTypes/components/CreateLinkTypeModal'

export const LINK_TYPE_SCHEMA: yup.ObjectSchema<LinkTypeFormValues> = yup.object({
  name: yup.string().trim().required('Name is required'),
  prefixUrl: yup.string().trim().required('Prefix URL is required').url('Must be a valid URL'),
  icon: yup
    .mixed<File | string>()
    .required('Icon is required')
    .test('is-valid-icon', 'Icon is required', (value) => {
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value instanceof File;
  })
})
