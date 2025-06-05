import * as yup from 'yup'

export const ADD_BOT_SCHEMA = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(1, "Minimum 1 characters")
    .max(64, "Maximum 64 characters"),
  isAutoPublished: yup.boolean().optional(),
  installLink: yup
    .string()
    .trim()
    .required("Install Link is required")
    .url("Invalid URL")
    .test("url-length", "URL is too long", (val) => val.length <= 2082),
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
    .required("Prefix is required")
    .min(1, "Minimum 1 characters")
    .max(10, "Maximum 10 characters"),
  featuredImage: yup.string().optional(),
  supportUrl: yup
    .string()
    .trim()
    .required("Support URL is required")
    .url("Invalid URL")
    .test("url-length", "URL is too long", (val) => val.length <= 2082),
  remark: yup.string().trim().optional(),
  tagIds: yup.array().of(yup.string().required()).min(1, "At least one tag is required").strict().defined(),
  socialLinks: yup.array().of(
    yup.object().shape({
      url: yup
        .string()
        .trim()
        .test("url-length", "URL is too long", (val) => (val || "").length <= 2082),
      linkTypeId: yup.string().required("Link Type is required")
    })
  )
})
