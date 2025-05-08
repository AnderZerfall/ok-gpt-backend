/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Question {
  @Prop()
  id: string;

  @Prop()
  question: string;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class QuestionOneChoice extends Question {
  @Prop()
  rightAnswer: string;

  @Prop([String])
  options: string[];
}

export type QuestionOneChoiceDocument = QuestionOneChoice & Document;
export const QuestionOneChoiceSchema =
  SchemaFactory.createForClass(QuestionOneChoice);

@Schema()
export class QuestionMultipleChoice extends Question {
  @Prop([String])
  rightAnswer: string[];

  @Prop([String])
  options: string[];
}

export type QuestionMultipleChoiceDocument = QuestionMultipleChoice & Document;
export const QuestionMultipleChoiceSchema = SchemaFactory.createForClass(
  QuestionMultipleChoice,
);
