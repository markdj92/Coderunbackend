import { AppGateway } from './gateway';
import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { UsersModule } from 'src/users/users.module';
@Module({
    imports: [UsersModule, RoomModule],
    providers : [AppGateway],
})
export class GatewayModule {}
