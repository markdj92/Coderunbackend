
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Problem } from './schemas/codingtest.schema';

@Injectable()
export class CodingTestService {
  constructor(private httpService: HttpService,
    @InjectModel(Problem.name) private readonly problemModel: Model<Problem>,
  ) { }

  async executeCode(script: string, language: string, versionIndex: number) {
    const response = this.httpService.post('https://api.jdoodle.com/v1/execute', {
      script,
      language,
      versionIndex,
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    });

    const responseContent = await firstValueFrom(response);
    return responseContent.data;
  }

  // for testing about saving data with json struct
  async insertProblemToDB() {
   
    const js = {
      "number": 1,
      "level": 1,
      "title": "A+B",
      "contents": "두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.",
      "input_contents": "첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)",
      "output_contents": "첫째 줄에 A+B를 출력한다.",
      "ex_input": "1 2",
      "ex_output": "3",
      "input":
      [
        [1, 2],
        [4, 5],
        [234,9]
      ],
      "output": 
      [
        [3],
        [9],
        [243]
      ]
    }
     try {
       const problem = await this.problemModel.create(js);
       console.log('Problem successfully saved.');
     } catch (error) {
      console.error('An error occurred while saving the problem:', error);
    }
  }

}
