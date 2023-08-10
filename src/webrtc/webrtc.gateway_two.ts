import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway({ cors: { origin: ['*'], credentials: true }, namespace: 'voice' })
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor() { }
    
rooms: { [key: string]: string[] } = {};
isRunning: { [key: string]: boolean } = {};
    
 @WebSocketServer() server: Server;

 afterInit(server: Server) {
 console.log('WebSocket server initialized.');
 }

 handleConnection(socket: Socket) {
 console.log(`Client connected: ${socket.id}`);
 }

 handleDisconnect(socket: Socket) {
 this.removeSocketFromRooms(socket);
 console.log(`Client disconnected: ${socket.id}`);
 }

 private removeSocketFromRooms(socket: Socket) { 
    for (const roomId of Object.keys(this.rooms)) {
        this.rooms[roomId] = this.rooms[roomId].filter(id => id !== socket.id);
        if (this.rooms[roomId].length === 0) {
            delete this.rooms[roomId];
        }
    }
 }

 @SubscribeMessage('createRoom')
 async handleMessage(@ConnectedSocket() socket, @MessageBody() title) {

    //방장이 방에 입장하도록 한다.
    socket.join(title);
    this.rooms[title] = []; // 방 참가자 초기화
    this.rooms[title].push(socket.id);
    this.isRunning[title] = false; // 방이 시작되었는지 여부 초기화
    console.log("createRoom join: ", title, socket.id);
    
    return { success: true }; 
 }

 @SubscribeMessage('joinRoom')
 handleJoinRoom(@ConnectedSocket() socket, @MessageBody() title) {

    if (!this.rooms[title]) {
        return { success: false, payload : { message : "존재하지 않는 방입니다." }};
    }
    if (this.rooms[title].length >= 10) {
        return { success: false, payload : { message : "방이 꽉 찼습니다." }};
    }
 
    if (this.isRunning[title]) {
        return { success: false, payload : { message : "현재 진행중인 방입니다." }};
    }

    socket.join(title);

    this.rooms[title].push(socket.id); //방 목록에 추가
     
    console.log("user list", this.rooms[title]);
    console.log("joinRoom join : ", title, socket.id);
    console.log("userlist", this.rooms[title]);
        
    socket.broadcast.to(title).emit("user-join", this.rooms[title]);
    return  { success: true, payload : { title: title, userlist: this.rooms[title] } }; 
 }

 @SubscribeMessage('offer')
 handleOffer(@ConnectedSocket() socket, @MessageBody() data) {
    const { title, offer, to } = data;
    if (this.rooms[title] && this.rooms[title].includes(to)) {
        socket.to(to).emit("offer", { title: title, offer: offer, from: socket.id });
    }
     return  { success: true }; 
 }

 @SubscribeMessage('answer')
 handleAnswer(@ConnectedSocket() socket, @MessageBody() data) {
    const { title, answer, to } = data;
    if (this.rooms[title] && this.rooms[title].includes(to)) {
        socket.to(to).emit("answer", { title: title, answer: answer, from: socket.id });
    }
    return  { success: true }; 
 }

 @SubscribeMessage('ice')
 handleIcecandidate(@ConnectedSocket() socket, @MessageBody() data) {
    const { title, icecandidate, to } = data;

    if (this.rooms[title] && this.rooms[title].includes(to)) {
        socket.to(to).emit("ice", { title: title, icecandidate: icecandidate, from: socket.id });
    }
        return  { success: true }; 
}
}