import { SchemaType } from './schema.types';

export type SessionType = SchemaType<{
  id: string;
  shop: string;
  isOnline: boolean;
  scope: string;
  expires: string;
  accessToken: string;
}>;
