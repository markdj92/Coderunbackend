import { AppGateway } from './gateway';
import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
@Module({
    imports: [UsersModule, RoomModule],
    providers : [AppGateway],
})
export class GatewayModule {}
