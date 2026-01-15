import { HttpResponse, RequestWithId } from '@app/types/API.types';
import { Tag } from '@app/types';
import { BasePaginationApiArg, SearchableApiArg } from '@app/types/common.types';

export type TagResponse = Tag & {
  botCount: number; 
};

export type CreateTagRequest = Pick<Tag, 'name' | 'slug'> & { color?: string };
export type UpdateTagRequest = Partial<CreateTagRequest> & { id: string };

export type TagControllerGetTagsApiResponse = HttpResponse<TagResponse[]>;
export type TagControllerGetTagsApiArg = void;

export type TagControllerSearchTagsApiArg = BasePaginationApiArg &
  SearchableApiArg & {
    sortField?: string;
    sortOrder?: string;
  };
export type TagControllerSearchTagsApiResponse = HttpResponse<TagResponse[]>;

export type TagControllerCreateTagApiResponse = HttpResponse<TagResponse>;
export type TagControllerCreateTagApiArg = {
  createTagRequest: CreateTagRequest;
};

export type TagControllerUpdateTagApiResponse = HttpResponse<TagResponse>;
export type TagControllerUpdateTagApiArg = {
  updateTagRequest: UpdateTagRequest;
};

export type TagControllerDeleteTagApiResponse = HttpResponse<CreateTagRequest>;
export type TagControllerDeleteTagApiArg = {
  requestWithId: RequestWithId;
};