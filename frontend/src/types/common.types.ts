export type BasePaginationApiArg = {
  pageSize: number;
  pageNumber: number;
};

export type BaseListApiArg = BasePaginationApiArg & {
  sortField: string;
  sortOrder: 'ASC' | 'DESC' | string;
};

export type SearchableApiArg = {
  search?: string;
  hasNewUpdate?: boolean;
};