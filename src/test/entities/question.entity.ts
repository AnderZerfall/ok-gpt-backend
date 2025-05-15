/* eslint-disable prettier/prettier */

export enum QuestionType {
  oneChoice = 'oneChoice',
  multipleChoice = 'multipleChoice',
  freeChoice = 'freeChoice',
}

export interface BaseQuestion {
  id: string;

  question: string;
}

export interface QuestionFree extends BaseQuestion {
  type: QuestionType.freeChoice;
}

export interface QuestionOneChoice extends BaseQuestion {
  rightAnswer: string;

  options: string[];

  type: QuestionType.oneChoice;
}

export interface QuestionMultipleChoice extends BaseQuestion {
  rightAnswer: string[];

  options: string[];

  type: QuestionType.multipleChoice;
}

export type Question =
  | QuestionFree
  | QuestionOneChoice
  | QuestionMultipleChoice;
