import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VictimDocument = Victim & Document;

@Schema()
export class Victim {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  family: string;

  @Prop({ required: true })
  murderMethod: string;

  @Prop({ type: Types.ObjectId, ref: 'Case', required: false })
  caseId?: Types.ObjectId;
}

export const VictimSchema = SchemaFactory.createForClass(Victim);