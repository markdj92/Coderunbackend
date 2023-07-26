import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CodingTestService } from './codingtest.service';

@Controller('codingtest')
export class CodingtestController {
      constructor(private codingTestService: CodingTestService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/execute')
    async executeCode(@Body() codePayload: { script: string, language: string, versionIndex: number }) {
        const result = await this.codingTestService.executeCode(codePayload.script, codePayload.language, codePayload.versionIndex);
        console.log(result);
        return result;
    }

    @Get()
    async getProblem(@Body() title: string) {
        
    }

    //FOR TESTING
    @Get('testing')
    async insertProblemToDB() {
        await this.codingTestService.insertProblemToDB();
    }

}
