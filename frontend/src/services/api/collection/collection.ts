import { api } from '../../apiInstance';
import type {
    CreateCollectionRequest,
    UpdateCollectionRequest,
    GetMyCollectionsArgs,
    AdminSearchCollectionsArgs,
    CollectionResponse,
    CollectionListResponse,
} from './collection.types';

const collectionService = api.injectEndpoints({
    endpoints: (build) => ({
        // Create collection
        createCollection: build.mutation<CollectionResponse, CreateCollectionRequest>({
            query: (body) => ({ url: '/api/collection', method: 'POST', body }),
            invalidatesTags: ['Collections'],
        }),

        // Get user's own collections
        getMyCollections: build.query<CollectionListResponse, GetMyCollectionsArgs>({
            query: (params) => ({ url: '/api/collection/my', params }),
            providesTags: ['Collections'],
        }),

        // Get single collection (public or own)
        getCollection: build.query<CollectionResponse, string>({
            query: (id) => ({ url: `/api/collection/${id}` }),
            providesTags: (_result, _error, id) => [{ type: 'Collections', id }],
        }),

        // Update collection
        updateCollection: build.mutation<CollectionResponse, UpdateCollectionRequest>({
            query: ({ id, ...body }) => ({ url: `/api/collection/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Collections', id },
                { type: 'Collections' },
            ],
        }),

        // Delete collection
        deleteCollection: build.mutation<void, string>({
            query: (id) => ({ url: `/api/collection/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Collections', id },
                { type: 'Collections' },
            ],
        }),

        // Admin search
        adminSearchCollections: build.query<CollectionListResponse, AdminSearchCollectionsArgs>({
            query: (params) => ({ url: '/api/collection/admin/search', params }),
            providesTags: ['Collections'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateCollectionMutation,
    useGetMyCollectionsQuery,
    useLazyGetMyCollectionsQuery,
    useGetCollectionQuery,
    useLazyGetCollectionQuery,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
    useAdminSearchCollectionsQuery,
    useLazyAdminSearchCollectionsQuery,
} = collectionService;