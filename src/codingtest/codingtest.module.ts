import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CodingTestService } from './codingtest.service';
import { CodingtestController } from './codingtest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Problem, ProblemSchema } from './schemas/codingtest.schema';

@Module({
  imports: [HttpModule,
  MongooseModule.forFeature([{ name: Problem.name, schema: ProblemSchema }]),
  ],
  providers: [CodingTestService],
  exports: [CodingTestService],
  controllers: [CodingtestController],
})
export class CodingtestModule {}
