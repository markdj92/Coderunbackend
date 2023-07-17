import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User,UserSchema} from './user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env',
      isGlobal: true,
    }),
    RoomModule, 
    MongooseModule.forRoot(process.env.MONGODB_ID),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService]
})

export class AppModule {}
