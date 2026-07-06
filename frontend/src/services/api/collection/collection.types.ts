import { HttpResponse } from '@app/types/API.types';
import { Collection } from '@app/types/collection.types';
import { CollectionStatus } from '@app/enums/collectionStatus.enum';

// DTOs for requests
export type CreateCollectionRequest = {
    title: string;
    description?: string;
    featuredImage?: string;
    status?: CollectionStatus;
    appIds?: string[];
};

export type UpdateCollectionRequest = Partial<CreateCollectionRequest> & {
    id: string;
};

export type GetMyCollectionsArgs = {
    pageNumber?: number;
    pageSize?: number;
    status?: CollectionStatus;
};

export type SearchCollectionsArgs = {
    search?: string;
    status?: CollectionStatus;
    ownerId?: string;
    pageNumber?: number;
    pageSize?: number;
};

// Response types wrapped in HttpResponse
export type CollectionResponse = HttpResponse<Collection>;
export type CollectionListResponse = HttpResponse<Collection[]>;