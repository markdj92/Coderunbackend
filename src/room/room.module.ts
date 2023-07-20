import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Room, RoomSchemas } from './schemas/room.schema'; 
import { RoomAndUser, RoomAndUserSchema } from './schemas/roomanduser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchemas },
      { name: RoomAndUser.name, schema: RoomAndUserSchema },
    ]),
    UserModule, // UserModule 추가
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}