import {
  Question,
  QuestionMultipleChoice,
  QuestionOneChoice,
} from '../entities/question.entity';
import { Test } from '../entities/test.entity';

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

export const mapperTestDtoToTest = (test: TestDto): Test => {
  return {
    id: test._id,
    name: test.name,
    description: test.description,
    questions: test.questions,
    ownerId: test.ownerId,
    allowedUsers: test.allowedUsers,
    deletedAt: test.deletedAt,
    createdAt: test.updatedAt,
    updatedAt: test.updatedAt,
    timeLimit: test.timeLimit,
  };
};

export const mapperTestToTestDto = (test: Test): TestDto => {
  return {
    _id: test.id,
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
