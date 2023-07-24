import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CodingTestService } from './codingtest.service';

@Module({
  imports: [HttpModule],
  providers: [CodingTestService],
  exports: [CodingTestService],
})
export class CodingtestModule {}
