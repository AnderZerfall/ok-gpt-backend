import { Types } from 'mongoose';
import {
  Question,
  QuestionMultipleChoice,
  QuestionOneChoice,
} from '../entities/question.entity';
import { TestDocument } from '../entities/test.entity';

export interface TestDto {
  _id: string;
  name: string;
  ownerId: number;
  description: string;
  questions: (Question | QuestionOneChoice | QuestionMultipleChoice)[];
  allowedUsers: string[];
  deletedAt: Date | null;
  updatedAt: Date;
  timeLimit: number | null;
}

export const mapDocumentToTest = (
  test: TestDocument & { _id: Types.ObjectId },
): TestDto => {
  return {
    _id: test._id.toString(),
    name: test.name,
    description: test.description,
    questions: test.questions,
    allowedUsers: test.allowedUsers,
    ownerId: test.ownerId,
    deletedAt: test.deletedAt,
    updatedAt: test.updatedAt,
    timeLimit: test.timeLimit,
  };
};
