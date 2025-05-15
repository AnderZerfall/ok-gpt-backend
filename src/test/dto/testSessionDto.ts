import { TestSession } from '../entities/test.session.entity';
import { UserAnswer } from '../entities/user-answer.entity';

export interface TestSessionDto {
  _id: string;
  testId: string;
  userEmail: string;
  answers: UserAnswer[];
  score: number;
  createdAt: Date;
  endedAt: Date;
  deletedAt?: Date | null;
}

export interface UpdatedTestSessionDto {
  userEmail?: string;
  answers?: UserAnswer[];
  score?: number;
  createdAt?: Date;
  endedAt?: Date;
  deletedAt?: Date | null;
}

export const mapperDtoToTestSession = (
  session: TestSessionDto,
): TestSession => {
  return {
    id: session._id,
    testId: session.testId,
    userEmail: session.userEmail,
    answers: session.answers,
    score: session.score,
    deletedAt: session.deletedAt,
    endedAt: session.endedAt,
    createdAt: session.createdAt,
  };
};

export const mapperTestSessionToDto = (
  session: TestSession,
): TestSessionDto => {
  return {
    _id: session.id,
    testId: session.testId,
    userEmail: session.userEmail,
    answers: session.answers,
    score: session.score,
    deletedAt: session.deletedAt,
    endedAt: session.endedAt,
    createdAt: session.createdAt,
  };
};
