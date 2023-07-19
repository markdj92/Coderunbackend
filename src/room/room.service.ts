import { UserService } from './../user/user.service';
import { RoomAndUser } from './schemas/roomanduser.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomCreateDto, RoomAndUserDto } from './dto/room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema'
import { Model,ObjectId,Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class RoomService {
    constructor(
        private readonly userService: UserService,
        @InjectModel(Room.name) private readonly roomModel: Model<Room>,
        @InjectModel(RoomAndUser.name) private readonly roomAndUserModel: Model<RoomAndUser>,

    ) {}
    
    async createRoom(room : RoomCreateDto, socket_id : string, user_id: ObjectId) : Promise<Room> {
        let newRoom;
        const found = await this.roomModel.findOne({title : room.title});
        if(found){
            throw new BadRequestException('Duplicate room title! please enter new title');
        }
        if(room.status == "PRIVATE"){
            const hashedPassword = await bcrypt.hash(room.password, 10);
            newRoom = new this.roomModel({...room, password : hashedPassword, socket_id : socket_id});
        }
        else{
            newRoom = new this.roomModel({...room, socket_id : socket_id});
        }
        const roomAndUserDto = new RoomAndUserDto();
        roomAndUserDto.socket_id = socket_id;
        roomAndUserDto.room_id = newRoom._id;
        roomAndUserDto.user_id = user_id;

        await this.saveRoomAndUser(roomAndUserDto);

        return newRoom.save();
    }

    async saveRoomAndUser(info : RoomAndUserDto) : Promise <void> {
        const newInfoForRoom = new this.roomAndUserModel({...info});
        await newInfoForRoom.save();
    }
    
}
