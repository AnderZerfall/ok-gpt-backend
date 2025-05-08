/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Question } from './question.entity';

@Schema()
export class Test {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop(Question)
  questions: Question[];

  @Prop()
  allowedUsers: string[];

  @Prop(Number)
  ownerId: number;

  @Prop({ type: Date, default: null, required: false })
  deleted_at: Date | null;

  @Prop(Date)
  created_at: Date;

  @Prop(Date)
  updated_at: Date;

  @Prop({ type: Number, default: null, required: false })
  timeLimit: number | null;
}

export type TestDocument = Test & Document;
export const TestSchema = SchemaFactory.createForClass(Test);
