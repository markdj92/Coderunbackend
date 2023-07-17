import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRequestDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Post("/join")
    @UsePipes(new ValidationPipe())
    createUser(
        @Body() userRequestDto : UserRequestDto
    ) : Promise<UserRequestDto> {
        return this.userService.createUser(userRequestDto);
    }

    @Post("/")
    @UsePipes(new ValidationPipe())
    validateUser(
        @Body() userRequestDto : UserRequestDto
    ) : Promise<any> {
        return this.userService.validateUser(userRequestDto);
    }

}
