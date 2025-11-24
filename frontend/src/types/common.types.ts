import { MezonAppType } from "@app/enums/mezonAppType.enum";

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
};

export type SearchMezonAppRequest = BaseListApiArg & SearchableApiArg & {
  tags?: string[];
  pricingTag?: string;
  price?: number;
  ownerId?: string;
  type?: MezonAppType;
  hasNewUpdate?: boolean;
  isAdmin?: boolean;
}