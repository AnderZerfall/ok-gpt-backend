import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './entities/test.entity';
import { TestSession, TestSessionSchema } from './entities/test.session.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: TestSession.name, schema: TestSessionSchema },
    ]),
  ],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
