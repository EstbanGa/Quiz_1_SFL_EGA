import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VictimDocument = Victim & Document;

@Schema()
export class Victim {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  family: string;

  @Prop()
  murderMethod: string;

  @Prop()
  caseId: string;
}

export const VictimSchema = SchemaFactory.createForClass(Victim);
