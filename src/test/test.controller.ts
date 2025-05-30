/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import { Test } from './entities/test.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { TestDto } from './dto/testDto';
import { UpdatedTestDto } from './dto/updatedTestDto';
import {
  FreeAnswerTestScore,
  TestSession,
} from './entities/test.session.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { TestSessionDto } from './dto/testSessionDto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req: { user: User }): Promise<TestDto[]> {
    return this.testService.findAll(req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<TestDto> {
    return this.testService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() test: Test, @Req() req: { user: User }): Promise<Test> {
    return this.testService.create(test, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<TestDto> {
    return this.testService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(
    @Body() updatedValues: { testId: string; updatedValues: UpdatedTestDto },
  ): Promise<TestDto> {
    return this.testService.updateById(
      updatedValues.testId,
      updatedValues.updatedValues,
    );
  }

  @Post('start')
  startTest(
    @Body()
    currentParticipant: {
      testId: string;
      email: string;
      username: string;
    },
  ): Promise<TestSession> {
    return this.testService.startTest(
      currentParticipant.testId,
      currentParticipant.email,
      currentParticipant.username,
    );
  }

  @Post('submit')
  endTest(
    @Body()
    submitTest: {
      testId: string;
      email: string;
      answers: UserAnswer[];
    },
  ): Promise<TestSession> {
    return this.testService.submitTest(
      submitTest.testId,
      submitTest.email,
      submitTest.answers,
    );
  }

  @Get('session/:id')
  async getTestSessionById(@Param('id') id: string): Promise<TestSessionDto> {
    return this.testService.findTestSessionById(id);
  }

  @Get('session/test/:testId')
  async getAllTestSessionByTestId(
    @Param('testId') testId: string,
  ): Promise<TestSessionDto[]> {
    return this.testService.findAllTestSessionsByTestId(testId);
  }

  @Post('session/calculate/:id')
  async calculateTestSession(
    @Param('id') id: string,
    @Body() freeAnswers: FreeAnswerTestScore[],
  ): Promise<TestSessionDto> {
    return this.testService.calculateTestScore(id, freeAnswers);
  }

  @Get('get-link/:id')
  getLinkToTheTest(@Param('id') id: string) {
    return this.testService.getTestLink(id);
  }
}
