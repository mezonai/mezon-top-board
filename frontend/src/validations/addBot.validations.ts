import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import * as yup from 'yup'
import { LINK_TYPE_SCHEMA } from './linkType.validation'

export const getAddBotSchema = (t: any) => yup.object({
  type: yup
    .mixed<MezonAppType>()
    .oneOf(Object.values(MezonAppType), t('validation.invalid_type'))
    .required(t('validation.required')),
  mezonAppId: yup
    .string()
    .trim()
    .required(t('validation.bot_app_id_required'))
    .max(2042, t('validation.bot_app_id_too_long'))
    .matches(/^\d+$/, t('validation.digits_only')),
  name: yup
    .string()
    .trim()
    .required(t('validation.name_required'))
    .min(1, t('validation.min_char', { count: 1 }))
    .max(64, t('validation.max_char', { count: 64 })),
  isAutoPublished: yup.boolean().required(t('validation.is_auto_published_required')),
  headline: yup
    .string()
    .trim()
    .required(t('validation.headline_required'))
    .min(50, t('validation.min_char', { count: 50 }))
    .max(510, t('validation.max_char', { count: 510 })),
  description: yup.string().trim().required(t('validation.full_desc_required')),
  prefix: yup
    .string()
    .trim()
    .when('type', {
      is: (val: MezonAppType) => val === MezonAppType.BOT,
      then: (schema) =>
        schema
          .required(t('validation.prefix_required'))
          .min(1, t('validation.min_char', { count: 1 }))
          .max(10, t('validation.max_char', { count: 10 })),
      otherwise: (schema) => 
        schema.optional().transform((value) => (value === '' ? undefined : value))
    }),
  featuredImage: yup.string().optional(),
  supportUrl: yup
    .string()
    .trim()
    .required(t('validation.support_url_required'))
    .url(t('validation.invalid_url'))
    .test("url-length", t('validation.url_too_long'), (val) => val.length <= 2082),
  remark: yup.string().trim().optional(),
  tagIds: yup.array().of(yup.string().required()).min(1, t('validation.at_least_one_tag')).strict().defined(),
  pricingTag: yup
    .mixed<AppPricing>()
    .oneOf(Object.values(AppPricing), t('validation.invalid_pricing_tag'))
    .required(t('validation.pricing_tag_required')),
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
          .min(0, t('validation.price_min'))
          .required(t('validation.price_required_paid')),
      otherwise: (schema) => schema.nullable(),
    }),
  socialLinks: yup.array().of(
    yup.object().shape({
      url: yup
        .string()
        .trim()
        .test("url-length", t('validation.url_too_long'), (val) => (val || "").length <= 2082),
      linkTypeId: yup.string().required(t('validation.link_type_required')),
      type: LINK_TYPE_SCHEMA.shape({
        id: yup.string().required(),
        icon: yup.string().required(),
      }).optional()
    })
  ).optional()
})