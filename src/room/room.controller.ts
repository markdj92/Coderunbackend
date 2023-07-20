import { ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { RoomService } from './room.service';

import { Body, Controller, Post, UsePipes, ValidationPipe, Get, UseGuards, Req } from '@nestjs/common';
import { RoomCreateDto } from './dto/room.dto';
import { Room } from './schemas/room.schema';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@ApiTags('Room')
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService,
        private readonly userService: UserService,) {}
    @ApiOperation({ summary: '해당 기능은 사용하지 않는 API 입니다, 소켓 create-room 호출시 클라이언트에서 제공해야 되는 값을 나타내기 위해 작성되었습니다. '})
    @Post('/create-room')
    @UsePipes(new ValidationPipe())
    createRoom(
        @Body() roomCreateDto : RoomCreateDto 
    ) : void {
        
    }
    // ): Promise<RoomCreateDto>{
    //     return this.roomService.createRoom(roomCreateDto);
    // }
    
    @ApiOperation({ summary: '입장 가능한 방 보여주기'})
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: Room, // 스키마 클래스 지정
    })
    
    @Get('/')
    @UseGuards(AuthGuard())
    getRoomList(@Req() req){
        return this.roomService.getRoomList(req.user);
    }
}
