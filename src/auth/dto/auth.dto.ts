import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class CheckDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "중복된 이메일체크" })
  email: string;
}

