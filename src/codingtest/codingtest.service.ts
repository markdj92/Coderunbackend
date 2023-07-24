import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CodingTestService {
  constructor(private httpService: HttpService) {}

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
}
