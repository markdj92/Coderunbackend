import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";

import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_ID),
    UserModule,
    RoomModule,
  ],
  controllers: [],
  providers: []
})

export class AppModule {}
