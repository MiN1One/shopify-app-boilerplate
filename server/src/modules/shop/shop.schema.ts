import { ShopType } from '@/types/shop.types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shop implements ShopType {
  @Prop({ required: true, unique: true })
  shop: string;

  @Prop({ required: true, type: Date })
  firstInstallDate: string;

  @Prop({ type: Date })
  uninstallDate: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
export type ShopDocument = Shop & Document;
