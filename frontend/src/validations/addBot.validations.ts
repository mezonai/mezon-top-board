import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import * as yup from 'yup'
import { LINK_TYPE_SCHEMA } from './linkType.validation'

export const ADD_BOT_SCHEMA = yup.object({
  type: yup
    .mixed<MezonAppType>()
    .oneOf(Object.values(MezonAppType), 'Invalid type')
    .required('Type is required'),
  mezonAppId: yup
    .string()
    .trim()
    .required('Bot or App ID is required')
    .max(2042, 'Bot or App ID is too long')
    .matches(/^\d+$/, 'Must contain digits only'),
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(1, "Minimum 1 characters")
    .max(64, "Maximum 64 characters"),
  isAutoPublished: yup.boolean().required("isAutoPublished is required"),
  headline: yup
    .string()
    .trim()
    .required("Headline is required")
    .min(50, "Minimum 50 characters")
    .max(510, "Maximum 510 characters"),
  description: yup.string().trim().required("Full Description is required"),
  prefix: yup
    .string()
    .trim()
    .when('type', {
      is: (val: MezonAppType) => val === MezonAppType.BOT,
      then: (schema) =>
        schema
          .required('Prefix is required')
          .min(1, 'Minimum 1 characters')
          .max(10, 'Maximum 10 characters'),
      otherwise: (schema) => 
        schema.optional().transform((value) => (value === '' ? undefined : value))
    }),
  featuredImage: yup.string().optional(),
  supportUrl: yup
    .string()
    .trim()
    .required("Support URL is required")
    .url("Invalid URL")
    .test("url-length", "URL is too long", (val) => val.length <= 2082),
  remark: yup.string().trim().optional(),
  tagIds: yup.array().of(yup.string().required()).min(1, "At least one tag is required").strict().defined(),
  pricingTag: yup
    .mixed<AppPricing>()
    .oneOf(Object.values(AppPricing), 'Invalid pricing tag')
    .required('Pricing tag is required'),
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
          .min(0, 'Price must be 0 or more')
          .required('Price is required for paid apps'),
      otherwise: (schema) => schema.nullable(),
    }),
  socialLinks: yup.array().of(
    yup.object().shape({
      url: yup
        .string()
        .trim()
        .test("url-length", "URL is too long", (val) => (val || "").length <= 2082),
      linkTypeId: yup.string().required("Link Type is required"),
      type: LINK_TYPE_SCHEMA.shape({
        id: yup.string().required(),
        icon: yup.string().required(),
      }).optional()
    })
  ).optional()
})