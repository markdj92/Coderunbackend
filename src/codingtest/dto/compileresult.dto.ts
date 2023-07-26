import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompileResultDto {
  replace(arg0: RegExp, arg1: string): any {
      throw new Error('Method not implemented.');
  }

  @IsNotEmpty()
  output: string;

  @IsNotEmpty()
  statuscode: string;

  @IsNotEmpty()
  memory: string;
  
  @IsNotEmpty()
  cputime : string
}