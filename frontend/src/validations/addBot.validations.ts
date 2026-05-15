import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import { AppLanguage } from '@app/enums/appLanguage.enum'
import * as yup from 'yup'
import { LINK_TYPE_SCHEMA } from './linkType.validation'
import { AppTranslationDto } from '@app/services/api/mezonApp/mezonApp.types'

const optionalTrimmedString = () =>
  yup
    .string()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() === '') return undefined
      return value
    })
    .trim()

const hasText = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0

const getDefaultTranslationInfo = (parent: unknown, translations: unknown) => {
  const defaultLanguage = (parent as { defaultLanguage?: AppLanguage } | undefined)?.defaultLanguage
  if (!defaultLanguage || !Array.isArray(translations)) return null

  const translationList = translations as AppTranslationDto[]
  const index = translationList.findIndex((t) => t?.language === defaultLanguage)

  return { defaultLanguage, index, translationList }
}

const requireDefaultTranslationField = (
  field: 'name' | 'headline' | 'description',
  message: 'validation.name_required' | 'validation.headline_required' | 'validation.full_desc_required'
) =>
  function (this: yup.TestContext, translations: unknown) {
    const info = getDefaultTranslationInfo(this.parent, translations)
    if (!info || info.index < 0) return true

    if (!hasText(info.translationList[info.index]?.[field])) {
      return this.createError({ path: `appTranslations.${info.index}.${field}`, message })
    }

    return true
  }

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

  defaultLanguage: yup
    .mixed<AppLanguage>()
    .oneOf(Object.values(AppLanguage))
    .required(),

  appTranslations: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().optional(),
        language: yup.mixed<AppLanguage>().oneOf(Object.values(AppLanguage)).required(),
        name: optionalTrimmedString().min(1).max(64),
        headline: optionalTrimmedString().min(50).max(510),
        description: optionalTrimmedString(),
      })
    )
    .required()
    .test('default-language-translation-exists', 'validation.required', function (translations) {
      const info = getDefaultTranslationInfo(this.parent, translations)
      if (!info) return true

      if (info.index === -1) {
        return this.createError({ path: 'appTranslations', message: 'validation.required' })
      }
      return true
    })
    .test('default-language-name-required', 'validation.name_required', requireDefaultTranslationField('name', 'validation.name_required'))
    .test(
      'default-language-headline-required',
      'validation.headline_required',
      requireDefaultTranslationField('headline', 'validation.headline_required')
    )
    .test(
      'default-language-description-required',
      'validation.full_desc_required',
      requireDefaultTranslationField('description', 'validation.full_desc_required')
    ),
  isAutoPublished: yup.boolean().required('validation.is_auto_published_required'),
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
  changelog: yup.string().trim().optional(),
})