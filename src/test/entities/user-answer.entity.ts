import { QuestionType } from './question.entity';

export interface BaseUserAnswer {
  questionId: string;
  question: string;
}

export interface UserOneAnswer extends BaseUserAnswer {
  type: QuestionType.oneChoice | QuestionType.freeChoice;
  answer: string;
}

export interface UserMultipleAnswer extends BaseUserAnswer {
  type: QuestionType.multipleChoice;
  answer: string[];
}

export type UserAnswer = UserOneAnswer | UserMultipleAnswer;
