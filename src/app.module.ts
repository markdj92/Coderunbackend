import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env',
      isGlobal: true,
    }),
    RoomModule, 
    MongooseModule.forRoot(process.env.MONGODB_ID)
  ],
  controllers: [RoomController],
  providers: [RoomService],
})

export class AppModule {}
