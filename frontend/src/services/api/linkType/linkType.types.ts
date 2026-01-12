import { HttpResponse, RequestWithId } from '@app/types/API.types';
import { LinkType } from '@app/types/link.types'; 

export type LinkTypeResponse = Pick<LinkType, 'id' | 'name' | 'icon'> & {
  prefixUrl?: string;
};
export type CreateLinkTypeRequest = Pick<LinkType, 'name' | 'icon'> & {
  prefixUrl?: string;
};

export type UpdateLinkTypeRequest = Partial<CreateLinkTypeRequest> & {
  id: string;
};

export type LinkTypeControllerGetAllLinksApiResponse = HttpResponse<LinkTypeResponse[]>;
export type LinkTypeControllerGetAllLinksApiArg = void;

export type LinkTypeControllerCreateLinkTypeApiResponse = HttpResponse<LinkTypeResponse>;
export type LinkTypeControllerCreateLinkTypeApiArg = {
  createLinkTypeRequest: CreateLinkTypeRequest;
};

export type LinkTypeControllerUpdateLinkTypeApiResponse = HttpResponse<LinkTypeResponse>;
export type LinkTypeControllerUpdateLinkTypeApiArg = {
  updateLinkTypeRequest: UpdateLinkTypeRequest;
};

export type LinkTypeControllerDeleteLinkTypeApiResponse = HttpResponse<LinkTypeResponse>;
export type LinkTypeControllerDeleteLinkTypeApiArg = {
  requestWithId: RequestWithId;
};