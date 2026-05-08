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
        }),

        // Get user's own collections
        getMyCollections: build.query<CollectionListResponse, GetMyCollectionsArgs>({
            query: (params) => ({ url: '/api/collection/my', params }),
        }),

        // Get single collection (public or own)
        getCollection: build.query<CollectionResponse, string>({
            query: (id) => ({ url: `/api/collection/${id}` }),
        }),

        // Update collection
        updateCollection: build.mutation<CollectionResponse, UpdateCollectionRequest>({
            query: ({ id, ...body }) => ({ url: `/api/collection/${id}`, method: 'PUT', body }),
        }),

        // Delete collection
        deleteCollection: build.mutation<void, string>({
            query: (id) => ({ url: `/api/collection/${id}`, method: 'DELETE' }),
        }),

        // Admin search
        adminSearchCollections: build.query<CollectionListResponse, AdminSearchCollectionsArgs>({
            query: (params) => ({ url: '/api/collection/admin/search', params }),
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