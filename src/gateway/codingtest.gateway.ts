import { ObjectId } from 'mongoose';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { RoomAndUserDto, RoomCreateDto, RoomStatusChangeDto } from 'src/room/dto/room.dto';
import { RoomService } from 'src/room/room.service';
import { UsersService } from 'src/users/users.service';
import { jwtSocketIoMiddleware } from './jwt-socket-io.middleware';

interface ExtendedSocket extends Socket {
    decoded : {email :string},
    user_id : ObjectId,
    nickname : String
}


@UseGuards(jwtSocketIoMiddleware)
@WebSocketGateway({cors : true, namespace: 'codingtest'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
    jdoodleService: any;
    constructor(private readonly roomService: RoomService,
        private readonly userService: UsersService, 
    ) {}

    private logger = new Logger('Coding Test');

    @WebSocketServer() nsp: Namespace;
    afterInit(server: any) {
        this.nsp.adapter.on('coding-test', (socket_id) => {
        this.logger.log(`"coding test client sokect id : ${socket_id}"이 생성되었습니다.`);
        });
    }

    async handleConnection(@ConnectedSocket()  socket: ExtendedSocket) {
        if (socket.handshake.headers && socket.handshake.headers.authorization) {
            const token = socket.handshake.headers.authorization.split(' ')[1]; 
        
            jwt.verify(token, process.env.JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                socket.disconnect();
                return;
            }
            this.logger.log(`"token 인증 되어있습니다!`);
            socket.decoded = decoded;
            const userInfo = await this.userService.getUserInfo(socket.decoded.email);
            socket.nickname = userInfo.nickname;

            // 개인마다 방을 만듬 ,  추후 해쉬해서 join 하는거 추가.
            socket.join(userInfo.nickname);
            });
          } else {
            socket.disconnect(); 
          }
    }

    async handleDisconnect(@ConnectedSocket() socket: ExtendedSocket)  {
        this.logger.log(`${socket.id} sockect disconnected!`);
    }

    @SubscribeMessage('join-user')
    async handleJoinUser(
      @MessageBody() joinUserNickName : string,
      @ConnectedSocket() socket: ExtendedSocket
    ) :Promise <{success : boolean, payload : {nickname : string}} > {
        
        // 추후 해쉬해서 join 하는거 추가.
        socket.join(joinUserNickName);
        return {success : true, payload : {nickname : joinUserNickName}}
    }

}
