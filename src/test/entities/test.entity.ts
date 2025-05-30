/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Question } from './question.entity';

const EXPIRE_DATE = 1000 * 60 * 60 * 24 * 3;
@Schema()
export class Test {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  questions: Question[];

  @Prop()
  allowedUsers: string[];

  @Prop(Number)
  ownerId: number;

  @Prop({
    type: Date,
    default: null,
    required: false,
    index: { expires: EXPIRE_DATE },
  })
  deletedAt: Date | null;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;

  @Prop({ type: Number, default: null, required: false })
  timeLimit: number | null;
}

export type TestDocument = Test & Document;
export const TestSchema = SchemaFactory.createForClass(Test);
