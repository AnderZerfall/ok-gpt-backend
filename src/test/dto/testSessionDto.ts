import { Types } from 'mongoose';
import { TestSessionDocument } from '../entities/test.session.entity';
import { UserAnswer } from '../entities/user-answer.entity';

export interface TestSessionDto {
  _id: string;
  testId: string;
  email: string;
  answers: UserAnswer[];
  score: number;
  createdAt: Date;
  endedAt: Date;
  deletedAt?: Date | null;
}

export interface UpdatedTestSessionDto {
  email?: string;
  answers?: UserAnswer[];
  score?: number;
  createdAt?: Date;
  endedAt?: Date;
  deletedAt?: Date | null;
}

export const mapperTestSessionToDto = (
  session: TestSessionDocument & { _id: Types.ObjectId },
): TestSessionDto => {
  return {
    _id: session._id.toString(),
    testId: session.testId,
    email: session.email,
    answers: session.answers,
    score: session.score,
    deletedAt: session.deletedAt,
    endedAt: session.endedAt,
    createdAt: session.createdAt,
  };
};
