import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types';

export enum CollectionStatus {
    PRIVATE = 'PRIVATE',
    PUBLISHED = 'PUBLISHED',
}

export interface Collection {
    id: string;
    title: string;
    description?: string | null;
    featuredImage?: string | null;
    status: CollectionStatus;
    ownerId: string;
    owner: {
        id: string;
        name: string;
        profileImage: string;
    };
    collectionApps: CollectionApp[];
    appCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CollectionApp {
    appId: string;
    order: number;
    app: GetMezonAppDetailsResponse;
}
