import { Module } from '@nestjs/common';
import { webRtcGateway } from './webrtc.gateway';
import { RoomGateway } from './webrtc.gateway_two';

@Module({
    imports: [],
    providers:[RoomGateway]
})
export class WebrtcModule {}
