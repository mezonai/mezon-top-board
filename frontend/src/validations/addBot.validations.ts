import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import * as yup from 'yup'
import { LINK_TYPE_SCHEMA } from './linkType.validation'

export const getAddBotSchema = yup.object({
  type: yup
    .mixed<MezonAppType>()
    .oneOf(Object.values(MezonAppType), 'validation.invalid_type')
    .required('validation.required'),
  mezonAppId: yup
    .string()
    .trim()
    .required('validation.bot_app_id_required')
    .max(2042, 'validation.bot_app_id_too_long')
    .matches(/^\d+$/, 'validation.digits_only'),
  name: yup
    .string()
    .trim()
    .required('validation.name_required')
    .min(1)
    .max(64),
  isAutoPublished: yup.boolean().required('validation.is_auto_published_required'),
  headline: yup
    .string()
    .trim()
    .required('validation.headline_required')
    .min(50)
    .max(510),
  description: yup.string().trim().required('validation.full_desc_required'),
  prefix: yup
    .string()
    .trim()
    .when('type', {
      is: (val: MezonAppType) => val === MezonAppType.BOT,
      then: (schema) =>
        schema
          .required('validation.prefix_required')
          .min(1)
          .max(10),
      otherwise: (schema) => 
        schema.optional().transform((value) => (value === '' ? undefined : value))
    }),
  featuredImage: yup.string().optional(),
  supportUrl: yup
    .string()
    .trim()
    .required('validation.support_url_required')
    .url('validation.invalid_url')
    .max(2082, 'validation.url_too_long'),
  tagIds: yup.array().of(yup.string().required()).min(1, 'validation.at_least_one_tag').strict().defined(),
  pricingTag: yup
    .mixed<AppPricing>()
    .oneOf(Object.values(AppPricing), 'validation.invalid_pricing_tag')
    .required('validation.pricing_tag_required'),
  price: yup
    .number()
    .nullable() 
    .default(0)
    .transform((value, originalValue) => 
      String(originalValue).trim() === '' ? null : value
    )
    .when('pricingTag', {
      is: AppPricing.PAID,
      then: (schema) => 
        schema
          .nullable()
          .min(0, 'validation.price_min')
          .required('validation.price_required_paid'),
      otherwise: (schema) => schema.nullable(),
    }),
  socialLinks: yup.array().of(
    yup.object().shape({
      url: yup
        .string()
        .trim()
        .max(2082, 'validation.url_too_long')
        .when('type', {
          is: (type: { prefixUrl?: string }) => !type?.prefixUrl,
          then: (schema) => schema.url('validation.missing_http_prefix'),
          otherwise: (schema) => schema
        }),
      linkTypeId: yup.string().required('validation.link_type_required'),
      type: LINK_TYPE_SCHEMA.shape({
        id: yup.string().required(),
        icon: yup.string().required(),
      }).optional()
    })
  ).optional(),
  changelog: yup.string().when('$isEdit', {
    is: true,
    then: (schema) => schema.required('validation.changelog_required'),
    otherwise: (schema) => schema.notRequired(),
  }),
})