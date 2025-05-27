import * as yup from 'yup'
import { LinkTypeFormValues } from '@app/pages/AdminPage/AdminManageLinkTypes/components/CreateLinkTypeModal'

export const LINK_TYPE_SCHEMA: yup.ObjectSchema<LinkTypeFormValues> = yup.object({
  name: yup.string().trim().required('Name is required').min(2, 'Name must be at least 2 characters'),
  prefixUrl: yup.string().trim().required('Prefix URL is required').url('Must be a valid URL'),
  icon: yup
    .mixed<File | string>()
    .required('Icon is required')
    .test('is-valid-icon', 'Icon must be a file or URL', (value) => typeof value === 'string' || value instanceof File)
})
