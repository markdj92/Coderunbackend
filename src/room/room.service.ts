import { Injectable } from '@nestjs/common';
import { RoomCreateDto } from './dto/room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema'
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}
    
    async createRoom(room : RoomCreateDto) : Promise<Room> {
        let newRoom;
        if(room.status == "PRIVATE"){
            const hashedPassword = await bcrypt.hash(room.password, 10);
            newRoom = new this.roomModel({...room, password : hashedPassword});
        }
        else{
            newRoom = new this.roomModel({...room});
        }
       
        return newRoom.save()
    }
}
