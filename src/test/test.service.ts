/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './entities/test.entity';
import { Model, Types } from 'mongoose';
import { UpdatedTestDto } from './dto/updatedTestDto';
import { UserAnswer, UserMultipleAnswer } from './entities/user-answer.entity';
import {
  FreeAnswerTestScore,
  TestSession,
  TestSessionDocument,
} from './entities/test.session.entity';
import { QuestionType } from './entities/question.entity';
import {
  mapperTestSessionToDto,
  TestSessionDto,
  UpdatedTestSessionDto,
} from './dto/testSessionDto';
import { mapDocumentToTest, TestDto } from './dto/testDto';

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

    if (!tests) {
      throw new NotFoundException('No test are available for this user');
    }

    return tests.map(mapDocumentToTest);
  }

  async findById(testId: string): Promise<TestDto> {
    const test = await this.testModel
      .findOne({ _id: testId, deletedAt: null })
      .exec();

    if (!test) {
      throw new Error('Test not found');
    }

    return mapDocumentToTest(test);
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
      .findOneAndUpdate({ _id: testId, deletedAt: null }, updatedValues, {
        runValidators: true,
      })
      .exec();

    if (!updatedTest) {
      throw new Error('Test not found');
    }

    return mapDocumentToTest(updatedTest);
  }

  async startTest(
    testId: string,
    email: string,
    username: string,
  ): Promise<TestSession> {
    const test = await this.findById(testId);

    const newTestSession = {
      testId: test._id,
      username: username,
      email: email,
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
      .findOneAndUpdate({ email, testId }, updatedValues)
      .exec();

    if (!testSession) {
      throw new Error('Test Session not found');
    }

    return testSession;
  }

  async deleteById(id: string): Promise<TestDto> {
    const objectId = new Types.ObjectId(id);

    const deletedTest = await this.testModel.findOneAndUpdate(
      { _id: objectId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );

    if (!deletedTest) {
      throw new Error('Test not found');
    }

    return mapDocumentToTest(deletedTest);
  }

  async findTestSessionById(sessionId: string): Promise<TestSessionDto> {
    const testSession = await this.testSessionModel
      .findOne({ _id: new Types.ObjectId(sessionId), deletedAt: null })
      .exec();

    if (!testSession) {
      throw new Error('Test session not found');
    }

    return mapperTestSessionToDto(testSession);
  }

  async findAllTestSessionsByTestId(testId: string): Promise<TestSessionDto[]> {
    Logger.log(testId);
    const testSessions = await this.testSessionModel
      .find({ testId: testId, deletedAt: null })
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
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(sessionId), deletedAt: null },
        updatedValues,
        {
          runValidators: true,
        },
      )
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
      .findOne({ _id: new Types.ObjectId(sessionId) })
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

  getTestLink(id: string) {
    return `${process.env.TEST_LINK_BASE}/test-session/${id}`;
  }
}
