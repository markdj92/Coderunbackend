import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';


interface WebRTC extends Socket {
    title : string
}

@WebSocketGateway({ cors: { origin: ['*'], credentials: true }, namespace: 'voice' })
export class RoomGateway implements  OnGatewayConnection, OnGatewayDisconnect {
    constructor() { }

rooms = {};
isRunning = {};
// rooms: { [key: string]: string[] } = {};
// isRunning: { [key: string]: boolean } = {};
    
 @WebSocketServer() server: Server;

 afterInit(server: WebRTC) {
 console.log('WebSocket se rver initialized.');
 }

 handleConnection(socket: WebRTC) {
 console.log(`Client connected: ${socket.id}`);
 }

 handleDisconnect(socket: WebRTC) {
 this.removeSocketFromRooms(socket);
 console.log(`Client disconnected: ${socket.id}`);
 }

 private removeSocketFromRooms(socket: WebRTC) { 
    for (const roomId of Object.keys(this.rooms)) {
        this.rooms[roomId] = this.rooms[roomId].filter(id => id !== socket.id);
        if (this.rooms[roomId].length === 0) {
            delete this.rooms[roomId];
        }
    }
 }

 @SubscribeMessage('createRoom')
 async handleMessage(@ConnectedSocket() socket : WebRTC, @MessageBody() title) {

    //방장이 방에 입장하도록 한다.
    socket.join(title);
    this.rooms[title] = []; // 방 참가자 초기화
    this.rooms[title].push(socket.id);
    this.isRunning[title] = false; // 방이 시작되었는지 여부 초기화
    console.log("createRoom join: ", title, socket.id);
     socket.title = title;
    return { success: true }; 
 }

 @SubscribeMessage('joinRoom')
 handleJoinRoom(@ConnectedSocket()  socket : WebRTC, @MessageBody() title) {

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
    socket.title = title;       
    this.rooms[title].push(socket.id); //방 목록에 추가
     
    console.log("user list", this.rooms[title]);
    console.log("joinRoom join : ", title, socket.id);
    console.log("userlist", this.rooms[title]);
        
     socket.broadcast.to(title).emit("entry", { userId: this.rooms[title] });
    return  { success: true, payload : { title: title, userlist: this.rooms[title] } }; 
 }

 @SubscribeMessage('offer')
 handleOffer(@ConnectedSocket()  socket : WebRTC,
     @MessageBody('title') title,
      @MessageBody('offer') offer,
       @MessageBody('to') to) {

     console.log("offer!")
     console.log("title :", title, " , offer :", offer, " to :", to);
     console.log("offer", socket.id);
     console.log("include : ", this.rooms[socket.title])
    if (this.rooms[ socket.title] ) {
        socket.to(to).emit("offer", { title:  socket.title, offer: offer, from: socket.id });
    }
     return  { success: true }; 
 }

 @SubscribeMessage('answer')
 handleAnswer(@ConnectedSocket()  socket : WebRTC, @MessageBody() data) {
    console.log("answer", socket.id);
    const { title, answer, to } = data;
    if (this.rooms[ socket.title]) {
        socket.to(to).emit("answer", { title: title, answer: answer, from: socket.id });
    }
    return  { success: true }; 
 }

 @SubscribeMessage('ice')
 handleIcecandidate(@ConnectedSocket()  socket : WebRTC, @MessageBody() data) {
    const { title, icecandidate, to } = data;
    console.log("ice", socket.id);
    if (this.rooms[socket.title] ) {
        socket.to(to).emit("ice", { title: title, icecandidate: icecandidate, from: socket.id });
    }
    
    return { success: true }; 
 }
    
@SubscribeMessage("leaveRoom")
handleLeaveRoom(@ConnectedSocket()  socket : WebRTC, @MessageBody() title) {
    console.log("leaveRoom", socket.id);
    socket.broadcast.to(socket.title).emit("someoneLeaveRoom", { userId: socket.id });
    return {success : true, payload : { userId: socket.id }}
}
}