import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CaseDocument = Case & Document;

@Schema()
export class Case {
  @Prop({ required: true })
  detective: string;

  @Prop({ type: [Types.ObjectId], ref: 'Victim', required: true })
  victims: Types.ObjectId[];

  @Prop({ required: true })
  weapon: string;

  @Prop()
  description?: string;

  @Prop()
  suspect?: string;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
