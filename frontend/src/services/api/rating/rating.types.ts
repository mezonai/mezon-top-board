import { HttpResponse } from '@app/types/API.types';
import { Rating, App, User } from '@app/types';

export type CreateRatingRequest = Pick<Rating, 'appId' | 'score' | 'comment'>;

export type RatingResponse = Pick<Rating, 'id' | 'score' | 'comment'> & {
  updatedAt: string; 
  user: Pick<User, 'id' | 'name' | 'profileImage'>;
  app: App;
};

export type RatingControllerCreateRatingApiResponse = unknown; 
export type RatingControllerCreateRatingApiArg = {
  createRatingRequest: CreateRatingRequest;
};

export type RatingControllerGetRatingByAppApiArg = {
  appId: string;
  pageNumber?: number;
};
export type RatingControllerGetRatingByAppApiResponse = HttpResponse<RatingResponse[]>;

export type RatingControllerGetAllRatingsByAppApiArg = {
  appId: string;
};
export type RatingControllerGetAllRatingsByAppApiResponse = HttpResponse<RatingResponse[]>;