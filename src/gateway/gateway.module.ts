import { AppGateway } from './gateway';
import { Module } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from 'src/user/jwt.strategy';

@Module({
    imports: [UserModule, RoomModule],
    providers : [AppGateway],
})
export class GatewayModule {}