import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserAnswer } from './user-answer.entity';

@Schema()
export class TestSession {
  @Prop()
  id: string;

  @Prop()
  testId: string;

  userEmail: string;

  answers: UserAnswer[];

  score: number;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  endedAt: Date;

  @Prop({ type: Date, default: null, required: false })
  deletedAt?: Date | null;
}

export type TestSessionDocument = TestSession & Document;
export const TestSessionSchema = SchemaFactory.createForClass(TestSession);

export interface FreeAnswerTestScore {
  questionId: string;
  score: number;
}
