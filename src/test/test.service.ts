/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './entities/test.entity';
import { Model } from 'mongoose';
import { UpdatedTestDto } from './dto/updatedTestDto';
import { UserAnswer, UserMultipleAnswer } from './entities/user-answer.entity';
import {
  FreeAnswerTestScore,
  TestSession,
  TestSessionDocument,
} from './entities/test.session.entity';
import { mapperTestToTestDto, TestDto } from './dto/testDto';
import { QuestionType } from './entities/question.entity';
import {
  mapperTestSessionToDto,
  TestSessionDto,
  UpdatedTestSessionDto,
} from './dto/testSessionDto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
    @InjectModel(TestSession.name)
    private testSessionModel: Model<TestSessionDocument>,
  ) {}

  async findAll(userId: number): Promise<TestDto[]> {
    const tests = await this.testModel
      .find({ ownerId: userId, deletedAt: null })
      .exec();

    return tests.map((test) => mapperTestToTestDto(test));
  }

  async findById(testId: string): Promise<TestDto> {
    const test = await this.testModel
      .findById({ _id: testId, deleted_at: null })
      .exec();

    if (!test) {
      throw new Error('Test not found');
    }

    return mapperTestToTestDto(test);
  }

  async create(test: Test, ownerId: number): Promise<Test> {
    const createdTest = new this.testModel({ ...test, ownerId });
    return createdTest.save();
  }

  async updateById(
    testId: string,
    updatedValues: UpdatedTestDto,
  ): Promise<TestDto> {
    const updatedTest = await this.testModel
      .findByIdAndUpdate({ id: testId, deleted_at: null }, updatedValues, {
        runValidators: true,
      })
      .exec();

    if (!updatedTest) {
      throw new Error('Test not found');
    }

    return mapperTestToTestDto(updatedTest);
  }

  async startTest(testId: string, email: string): Promise<TestSession> {
    const test = await this.findById(testId);

    const newTestSession = {
      testId: test._id,
      userEmail: email,
      createdAt: new Date(),
      endedAt: null,
    };

    const testSession = new this.testSessionModel(newTestSession);

    return testSession.save();
  }

  async submitTest(
    testId: string,
    email: string,
    answers: UserAnswer[],
  ): Promise<TestSession> {
    const updatedValues = {
      answers,
      endedAt: new Date(),
    };

    const testSession = await this.testSessionModel
      .findByIdAndUpdate({ userEmail: email, testId }, updatedValues, {
        runValidators: true,
      })
      .exec();

    if (!testSession) {
      throw new Error('Test not found');
    }

    return testSession;
  }

  async deleteById(id: string): Promise<TestDto> {
    const deletedTest = await this.testModel.findByIdAndUpdate(
      { id, deleted_at: null },
      { deletedAt: new Date() },
      { runValidators: true },
    );

    if (!deletedTest) {
      throw new Error('Test not found');
    }

    return mapperTestToTestDto(deletedTest);
  }

  async findTestSessionById(sessionId: string): Promise<TestSessionDto> {
    const testSession = await this.testSessionModel
      .findById({ _id: sessionId, deleted_at: null })
      .exec();

    if (!testSession) {
      throw new Error('Test session not found');
    }

    return mapperTestSessionToDto(testSession);
  }

  async findAllTestSessionsByTestId(testId: string): Promise<TestSessionDto[]> {
    const testSessions = await this.testSessionModel
      .find({ testId: testId, deleted_at: null })
      .exec();

    if (!testSessions) {
      throw new Error('Test session not found');
    }

    return testSessions.map((session) => mapperTestSessionToDto(session));
  }

  async updateByTestSessionId(
    sessionId: string,
    updatedValues: UpdatedTestSessionDto,
  ): Promise<TestSessionDto> {
    const updatedTestSession = await this.testSessionModel
      .findByIdAndUpdate({ id: sessionId, deleted_at: null }, updatedValues, {
        runValidators: true,
      })
      .exec();

    if (!updatedTestSession) {
      throw new Error('Test session not found');
    }

    return mapperTestSessionToDto(updatedTestSession);
  }

  async calculateTestScore(
    sessionId: string,
    freeAnswers: FreeAnswerTestScore[] | null,
  ): Promise<TestSessionDto> {
    const testSession = await this.testSessionModel
      .findOne({ id: sessionId })
      .exec();

    if (!testSession) {
      throw new Error('Test session not found');
    }

    let score = 0;

    const test = await this.findById(testSession.testId);

    testSession.answers.map((answer) => {
      const question =
        test?.questions.find((question) => question.id === answer.questionId) ||
        null;

      if (question) {
        switch (question.type) {
          case QuestionType.oneChoice: {
            if (question.rightAnswer === answer.answer) {
              score += 1;
            }

            break;
          }
          case QuestionType.multipleChoice:
            (answer as UserMultipleAnswer).answer.map(
              (answer) =>
                (score = question.rightAnswer.includes(answer)
                  ? score + 1
                  : score),
            );
            break;
          case QuestionType.freeChoice:
            if (freeAnswers) {
              const freeAnswer = freeAnswers.find(
                (freeAnswer) => freeAnswer.questionId === question.id,
              );

              if (freeAnswer) {
                score += freeAnswer.score;
              }

              break;
            }

            throw new Error(
              'Free answers are required for free choice questions',
            );
          default:
        }
      }
    });

    return this.updateByTestSessionId(sessionId, { score });
  }
}
