import { RoomService } from './room.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoomCreateDto } from './dto/room.dto';

@Controller('room')
export class RoomController {
    // constructor(private roomService: RoomService) {}
    // @Post('/create-room')
    // @UsePipes(new ValidationPipe())
    // createRoom(
    //     @Body() roomCreateDto : RoomCreateDto 
    // ): Promise<RoomCreateDto>{
    //     return this.roomService.createRoom(roomCreateDto);
    // }
}
