import { RoomAndUser } from './schemas/roomanduser.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomCreateDto, RoomAndUserDto } from './dto/room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema'
import { Model,ObjectId,ObjectIdSchemaDefinition,Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class RoomService {
    constructor(
        private readonly userService: UsersService,
        @InjectModel(Room.name) private readonly roomModel: Model<Room>,
        @InjectModel(RoomAndUser.name) private readonly roomAndUserModel: Model<RoomAndUser>,

    ) {}
    
    async createRoom(room :RoomCreateDto, email : string, socket_id: string) : Promise<Room> {
        let newRoom;
        const found = await this.roomModel.findOne({title : room.title});
        if(found){
            throw new BadRequestException('Duplicate room title! please enter new title');
        }
        if(room.status == "PRIVATE"){
            const hashedPassword = await bcrypt.hash(room.password, 10);
            newRoom = new this.roomModel({...room, password : hashedPassword});
        }
        else{
            newRoom = new this.roomModel({...room});
        }
        const user = await this.userService.userInfoFromEmail(email);

        const roomAndUserDto = new RoomAndUserDto();
        roomAndUserDto.room_id = newRoom._id;
        roomAndUserDto.user_id = user._id;
        roomAndUserDto.socket_id = socket_id;

        await this.saveRoomAndUser(roomAndUserDto);

        return newRoom.save();
    }

    async saveRoomAndUser(info : RoomAndUserDto) : Promise <void> {
        const newInfoForRoom = new this.roomAndUserModel({...info});
        await newInfoForRoom.save();
    }

    async getRoomList(req) : Promise<Room[]> {
        const rooms = await this.roomModel.find().exec();
        const result = rooms.filter(room => room.ready === true);
        const userid = req._id;
        console.log(userid);
        return result;
    }
    
    async getRoomIdFromTitle(title : string) : Promise<ObjectId> {
        const room = await this.roomModel.findOne({title: title}).exec();
        return room._id;
    }
    async getSocketId(room_id : ObjectId) : Promise<string> {
        const roominfo = await this.roomAndUserModel.findOne({room_id : room_id}).exec();
        const socket_id = roominfo.socket_id;
        return socket_id;
    }

    async checkRoomCondition(title_name : string) : Promise<boolean> {
        const room = await this.roomModel.findOne({title : title_name}).exec();
        if (room && room.member_count < room.max_members && room.ready === true){
            return true;
        }
        return false;
    }

    async chageRoomStatus(room_id : ObjectId) : Promise<void> {
        const room = await this.roomModel.findById(room_id);
        room.member_count += 1;
        if(room.member_count === room.max_members){
            room.ready = false;
        }

    }
}
