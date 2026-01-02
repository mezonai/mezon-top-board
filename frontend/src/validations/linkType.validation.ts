import * as yup from 'yup'
import { LinkTypeFormValues } from '@app/pages/AdminPage/AdminManageLinkTypes/components/LinkTypeModal'

export const LINK_TYPE_SCHEMA: yup.ObjectSchema<LinkTypeFormValues> = yup.object({
  name: yup.string().trim().required('validation.name_required'),
  prefixUrl: yup.string().trim().required('validation.prefix_url_required'),
  icon: yup
    .mixed<File | string>()
    .required('validation.icon_required')
    .test('is-valid-icon', '', (value) => {
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return value instanceof File;
  })
})
