/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import { Test } from './entities/test.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { TestDto } from './dto/TestDto';
import { UpdatedTestDto } from './dto/updatedTestDto';
import { TestSession } from './entities/test.session.entity';
import { UserAnswer } from './entities/user-answer.entity';

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
  @Post()
  update(
    @Body() updatedValues: { testId: string; updatedValues: UpdatedTestDto },
  ): Promise<TestDto> {
    return this.testService.updateById(
      updatedValues.testId,
      updatedValues.updatedValues,
    );
  }

  @Post()
  startTest(
    @Body() currentParticipant: { testId: string; email: string },
  ): Promise<TestSession> {
    return this.testService.startTest(
      currentParticipant.testId,
      currentParticipant.email,
    );
  }

  @Post()
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
}
