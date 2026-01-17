import { SessionType } from '@/types/session.types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session implements SessionType {
  @Prop({ required: true })
  shop: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  scope: string;

  @Prop()
  expires: string;

  @Prop({ unique: true, required: true })
  id: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export type SessionDocument = Session & Document;
