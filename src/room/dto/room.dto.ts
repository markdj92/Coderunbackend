import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { IsEnum, IsOptional, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ async: false })
export class IsPasswordRequiredConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        const { status, password } = args.object as RoomCreateDto;
        if (status === RoomStatus.PRIVATE && !password) {
            return false; // password must be defined if status is PRIVATE
        }
        return true; 
    }

    defaultMessage(args: ValidationArguments) {
        return 'Password is required when status is PRIVATE.';
    }
}

export enum RoomStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}

export enum RoomMode {
    STUDY = 'STUDY',
    COOPERATIVE  = 'COOPERATIVE'
}

export class RoomCreateDto {

    @IsNotEmpty()
    @IsString()
    title : string;

    @IsNotEmpty()
    @IsNumber()
    max_members : number;

    @IsEnum(RoomStatus)
    status : RoomStatus;

    @IsOptional()
    @Validate(IsPasswordRequiredConstraint)
    password : string;

    @IsNotEmpty()
    level : number;

    @IsEnum(RoomMode)
    mode : RoomMode;
}