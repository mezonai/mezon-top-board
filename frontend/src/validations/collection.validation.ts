import * as yup from 'yup';

export const collectionSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required('Title is required')
        .max(255, 'Title must be at most 255 characters'),
    description: yup.string().trim().optional(),
    featuredImage: yup.string().optional(),
    status: yup
        .string()
        .oneOf(['PRIVATE', 'PUBLISHED'], 'Invalid status')
        .required('Status is required'),
    appIds: yup.array().of(yup.string().required()).optional(),
});