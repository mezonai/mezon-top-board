import { RequestWithId as CoreRequestWithId } from '@app/types/API.types';

export type BaseListApiArg = {
  pageSize: number;
  pageNumber: number;
  sortField: string;
  sortOrder: 'ASC' | 'DESC' | string;
};

export type SimplePaginationApiArg = {
  pageSize: number;
  pageNumber: number;
};

export type SearchableApiArg = {
  search?: string;
};

export type RequestWithId = CoreRequestWithId;