import { App } from './app.types';
import { User } from './user.types';

export type FavoriteApp = {
  userId: string;
  appId: string;
  user?: User;
  app?: App;
  createdAt?: string;
  updatedAt?: string;
};