import { GetMezonAppDetailsResponse } from '@app/services/api/mezonApp/mezonApp.types';
import { CollectionStatus } from '@app/enums/collectionStatus.enum';

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
    apps: GetMezonAppDetailsResponse[];
    appCount?: number;
    createdAt: string;
    updatedAt: string;
}
