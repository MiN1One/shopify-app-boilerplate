import { SchemaType } from './schema.types';

export type ShopType = SchemaType<{
  shop: string;
  firstInstallDate: string;
  uninstallDate: string;
}>;
