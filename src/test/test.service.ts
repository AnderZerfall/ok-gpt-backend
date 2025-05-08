import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './entities/test.entity';
import { Model } from 'mongoose';
import { UpdatedTestDto } from './dto/updatedTestDto';
import { UserAnswer } from './entities/user-answer.entity';
import {
  TestSession,
  TestSessionDocument,
} from './entities/test.session.entity';
import { mapperTestToTestDto, TestDto } from './dto/TestDto';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
    @InjectModel(TestSession.name)
    private testSessionModel: Model<TestSessionDocument>,
  ) {}

  async findAll(userId: number): Promise<TestDto[]> {
    const tests = await this.testModel
      .find({ ownerId: userId, deleted_at: null })
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
      { deleted_at: new Date() },
      { runValidators: true },
    );

    if (!deletedTest) {
      throw new Error('Test not found');
    }

    return mapperTestToTestDto(deletedTest);
  }
}
