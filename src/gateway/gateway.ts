import { AuthService } from './../auth/auth.service';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
import { RoomCreateDto, RoomStatusChangeDto } from 'src/room/dto/room.dto';
import { RoomService } from 'src/room/room.service';
import { UsersService } from 'src/users/users.service';
import { jwtSocketIoMiddleware } from './jwt-socket-io.middleware';
import { CodingTestService } from 'src/codingtest/codingtest.service';
import { CompileResultDto } from 'src/codingtest/dto/compileresult.dto';
import { CodeSubmission, ExtendedSocket, JoinRoomPayload, ResponsePayload } from './interface'



@ApiTags('Room')
@UseGuards(jwtSocketIoMiddleware)
@WebSocketGateway({cors : true, namespace: 'room'})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly roomService: RoomService,
        private readonly userService: UsersService, 
        private readonly codingService: CodingTestService,
        private readonly authService: AuthService
    ) {}

    private logger = new Logger('Room');

    @WebSocketServer() nsp: Namespace;
    afterInit(server: any) {
        this.logger.log('Initialized!');
    
    }

    async handleConnection(@ConnectedSocket()  socket: ExtendedSocket) {
        if (socket.handshake.headers && socket.handshake.headers.authorization) {

            const token = socket.handshake.headers.authorization.split(' ')[1]; 
        
            jwt.verify(token, process.env.JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                socket.disconnect();
                return;
            }
            socket.decoded = decoded;
                this.logger.log(`"token 인증 되어있습니다!`);
                this.logger.log(`${socket.id} sockect connected!`);
            const user_id = await this.userService.userInfoFromEmail(socket.decoded.email);
            socket.user_id = user_id;
            this.authService.saveSocketId(decoded.email, socket.id);
            });
          } else {
            socket.disconnect(); // 연결을 끊음
          }
    }


    async handleDisconnect(@ConnectedSocket() socket: ExtendedSocket)  {
        const check = await this.roomService.checkWrongDisconnection(socket.decoded.email);
        if (!check) {
            const result = await this.roomService.changeRoomStatusForLeave(socket.room_id, socket.user_id);
            if(result){
                const title = await this.roomService.getTitleFromRoomId(socket.room_id);
                socket.leave(await title);
                const roomAndUserInfo = await this.roomService.getRoomInfo(socket.room_id);
                if (roomAndUserInfo !== false) {
                    await this.nsp.to(await title).emit('room-status-changed', roomAndUserInfo);   
                }
            }  
        }
        this.logger.log(`${socket.id} sockect disconnected!`);
    }

    @SubscribeMessage('create-room')
    async handleCreateRoom(
      @MessageBody() roomCreateDto: RoomCreateDto,
      @ConnectedSocket() socket: ExtendedSocket
    ): Promise<ResponsePayload> {
        const dup_check = await this.roomService.duplicationCheck(roomCreateDto.title);
        if (!dup_check) {
            return { success: false, payload: { message: "중복된 방제입니다." } };
        }
        const room = await this.roomService.createRoom(roomCreateDto, socket.decoded.email);

        if (!room) {
            this.logger.log(`Room creation failed : ${socket.decoded.email}`);
            return { success: false, payload: { message: "방을 생성 할 수 없습니다. 다시 시도해주세요." } };
        }

        await room.save(); 
        socket.join(room.title); 
        const room_id = await this.roomService.getRoomIdFromTitle(roomCreateDto.title);
        socket.room_id = room_id;
        const roomAndUserInfo = await this.roomService.getRoomInfo(room_id);
        if (roomAndUserInfo == null || false || undefined) {
            return { success: false, payload: { message: "방을 생성 할 수 없습니다. 다시 시도해주세요." }};    
        }
        return {success : true,  payload: { roomInfo : roomAndUserInfo}}
    }

    
    @SubscribeMessage('join-room')
    async handleJoinRoom( 
        @MessageBody() joinRoomPayload : JoinRoomPayload,
        @ConnectedSocket() socket: ExtendedSocket): 
        Promise <ResponsePayload > {

        this.logger.log(`${socket.id} : 방에 입장 준비 중입니다!`);
        const condition = await this.roomService.checkRoomCondition(joinRoomPayload.title);
        const passwordcheck = await this.roomService.checkRoomPassword(joinRoomPayload.title, joinRoomPayload.password);

        let roomAndUserInfo: RoomStatusChangeDto | boolean;
        
        if (!condition) {
            return { success : false, payload: { message : "방에 입장 할 수 없습니다."}}  
        }
        else if (!passwordcheck) {
            return { success : false, payload: { message : "방 비밀번호가 일치하지 않습니다."}}  
        }
        else {
            const room_id = await this.roomService.getRoomIdFromTitle(joinRoomPayload.title);
            socket.join(await joinRoomPayload.title);
            const user_id = await this.userService.userInfoFromEmail(socket.decoded.email);
            socket.user_id = user_id;
            socket.room_id = room_id;

            await this.roomService.changeRoomStatusForJoin(room_id, user_id);
            
            roomAndUserInfo = await this.roomService.getRoomInfo(room_id);
            this.nsp.to(joinRoomPayload.title).emit('room-status-changed', roomAndUserInfo);
        }
        this.logger.log(`${socket.id} : 방에 입장 완료하였습니다!`);

        return {success : true, payload: { roomInfo : roomAndUserInfo}}  
      }

    @SubscribeMessage('leave-room')
    async handleLeaveRoom(
        @MessageBody('title') title : string,
        @ConnectedSocket() socket: ExtendedSocket): Promise <{success : boolean} > {
        
        const room_id = await this.roomService.getRoomIdFromTitle(title);
        await this.roomService.changeRoomStatusForLeave(room_id, socket.user_id);

        socket.leave(await title);
  
        const roomAndUserInfo = await this.roomService.getRoomInfo(await room_id);
        if (await roomAndUserInfo !== false) {
            await this.nsp.to(title).emit('room-status-changed', roomAndUserInfo);   
        }
        return {success : true}  
    }

    @SubscribeMessage('change-owner')
    async handleChangeOwner(
        @MessageBody('title') title : string,  @MessageBody('index') userIndex : number,
        @ConnectedSocket() socket: ExtendedSocket): 
            Promise <{success : boolean, payload : {owner : number}} > {
        
        await this.roomService.changeOwner(socket.room_id, socket.user_id, userIndex);
        const roomAndUserInfo = await this.roomService.getRoomInfo(socket.room_id);
        if (roomAndUserInfo !== false) {
            await this.nsp.to(await title).emit('room-status-changed', roomAndUserInfo);   
        }
        return {success : true, payload : {owner : userIndex}}  
    }

    @SubscribeMessage('ready')
    async handleReadyUser(
    @MessageBody('title') title: string,
    @ConnectedSocket() socket: ExtendedSocket
    ): Promise<{ success: boolean; payload:{ nickname?: string, status?: boolean;}}> {
    try {
        const room_id = await this.roomService.getRoomIdFromTitle(title);
        const user_id = await this.userService.userInfoFromEmail(socket.decoded.email);
        const userStatus = await this.roomService.setUserStatusToReady(room_id, user_id);
        const roomAndUserInfo = await this.roomService.getRoomInfo(room_id);

        if (roomAndUserInfo instanceof RoomStatusChangeDto) {
            roomAndUserInfo.user_info
            userStatus.status;
            await this.nsp.to(title).emit('room-status-changed', roomAndUserInfo);
            return { success: true, payload: { nickname: userStatus.nickname, status : userStatus.status }};
        } else {
            return { success: false, payload: { nickname: userStatus.nickname, status : userStatus.status }};
        }
    } catch (error) {
        console.error('Error handling ready user', error);
        return { success: false, payload: { nickname: undefined, status : undefined }};
    }
  }

    @SubscribeMessage('reviewUser')
    async handleReviewUser(
    @MessageBody('title') title : string,
    @ConnectedSocket() socket: ExtendedSocket
    ): Promise<{success : boolean, payload : {roomInfo : RoomStatusChangeDto | boolean}} >{
        await this.roomService.getResult(socket.room_id, socket.user_id);

        const roomAndUserInfo = await this.roomService.getRoomInfo(socket.room_id);
        await this.nsp.to(title).emit('room-status-changed', roomAndUserInfo);

       return {success : true, payload: { roomInfo : roomAndUserInfo}}  
    }


    @SubscribeMessage('lockunlock')
    async handlelock(
        @MessageBody('title') title: string, @MessageBody('index') index: number,
        @ConnectedSocket() socket : ExtendedSocket
    ): Promise<{success : boolean, payload : {roomInfo : RoomStatusChangeDto | boolean}}> {
        try {
    
    const room_id = await this.roomService.getRoomIdFromTitle(title);
    const roomAndUser = await this.roomService.unlockRoom(room_id, index); 
    
    if (!roomAndUser) {
        console.log('No roomAndUser returned');
        return { success: false, payload: { roomInfo: false } };
    }
        
    const roomAndUserInfo = await this.roomService.getRoomInfo(room_id); 
    await this.nsp.to(title).emit('room-status-changed', roomAndUserInfo);
    return {success : true, payload: { roomInfo : roomAndUserInfo}} 
    } catch (error) {
        return { success: false, payload: { roomInfo: false } };
        }
    }
    
    @SubscribeMessage('start')
    async handleStart(
    @MessageBody('title') title : string,
    @ConnectedSocket() socket: ExtendedSocket
    ){
        await this.nsp.to(title).emit('start', { "title" : title });
    }



    @SubscribeMessage('quick-join')
    async handleQuickJoinRoom(
    @ConnectedSocket() socket: ExtendedSocket): 
    Promise<{ success: boolean }> {

        const email = socket.decoded.email; 
        const roomInfo = await this.roomService.findRoomForQuickJoin();

        if (!roomInfo) {
            return { success: false }; 
        } 
        const userSocketid = await this.authService.getSocketIdByuserId(socket.user_id);
        this.nsp.to(await userSocketid).emit('readyQuickJoin', roomInfo.title);
        return { success: true }; 
    }

    @SubscribeMessage('submitCode')
    async handleSubmitCode(
        @MessageBody() codeSubmission: CodeSubmission,
        @ConnectedSocket() socket: ExtendedSocket) {
        const userOutputResult = []; 
        const problem = await this.codingService.getProblemInput(codeSubmission.problemNumber);
        let result; 
         for (const index of problem.input) {
            result = await this.codingService.executeCode(codeSubmission.script, codeSubmission.language, codeSubmission.versionIndex, index);
            if (!(result instanceof CompileResultDto)) {
                return result;
            }
            const resultOutput = result.output.replace(/\n/g, '');
            userOutputResult.push(resultOutput);
        }
        
        if (userOutputResult.length == problem.output.length && 
            userOutputResult.every((value, index) => value == problem.output[index])) {
            await this.codingService.saveSolvedInfo(socket.decoded.email, codeSubmission.title);  
        }
        await this.codingService.saveSubmitInfo(socket.decoded.email, codeSubmission.title);
        const finish = await this.codingService.checkFinish(codeSubmission.title);

        return { success: finish, payload: { result: result } };  
    }

    @SubscribeMessage('forceLeave')
    async handleForceLeave(
        @MessageBody('title') title: string, @MessageBody('index') index: number,
        @ConnectedSocket() socket: ExtendedSocket) {
        
        const userId = this.roomService.getUserIdFromIndex(title, index);
        const userSocketid = this.authService.getSocketIdByuserId(await userId);
        this.nsp.to(await userSocketid).emit('kicked', title);
     
    }

}
