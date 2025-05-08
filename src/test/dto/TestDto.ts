import { Question } from '../entities/question.entity';
import { Test } from '../entities/test.entity';

export interface TestDto {
  _id: string;
  name: string;
  ownerId: number;
  description: string;
  questions: Question[];
  allowedUsers: string[];
  deleted_at: Date | null;
  updated_at: Date;
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
    deleted_at: test.deleted_at,
    created_at: test.updated_at,
    updated_at: test.updated_at,
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
    deleted_at: test.deleted_at,
    updated_at: test.updated_at,
    timeLimit: test.timeLimit,
  };
};
