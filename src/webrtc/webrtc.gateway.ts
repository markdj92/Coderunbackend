import { WebSocketGateway, WebSocketServer, SubscribeMessage } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'


@WebSocketGateway({cors : true})
export class webRtcGateway{
    @WebSocketServer() server: Server;

    // 1단계 - 입장 알림
    @SubscribeMessage("join")
    async handleJoinMessage(client: Socket, roomId: any){
        client.join(roomId);
        client.broadcast.to(roomId).emit("enter", { userId: client.id });
    }

    // 2단계 - 연결 요청
    @SubscribeMessage("offer")
    handleOfferMessage(client: Socket, { offer, selectedRoom }){
        client.broadcast.to(selectedRoom).emit("offer", { userId: client.id, offer });
    }

    // 3단계 - 응답 생성
    @SubscribeMessage("answer")
    handleAnswerMessage(client: Socket, {answer, toUserId, selectedRoom}){
        client.broadcast.to(selectedRoom).emit("answer", { 
            userId: client.id,
            answer, 
            toUserId,
        });
    }

    // 4단계 - 연결 후보 교환
    @SubscribeMessage("icecandidate")
    handleIcecandidateMessage(client: Socket, { candidate, selectedRoom }){
        client.broadcast.to(selectedRoom).emit("icecandidate", { userId: client.id, candidate });
    }


    // 본인 연결 해지
    @SubscribeMessage("leaveRoom")
    handleLeaveRoom(client: Socket, selectedRoom: any ) {
        // 클라이언트의 연결 해제 이벤트 처리
        client.emit("youLeaveRoom", { userId: client.id });
        client.broadcast.to(selectedRoom).emit("someoneLeaveRoom", { userId: client.id });
    }
    
    @SubscribeMessage("exit")
    handlExitUser(client:Socket, selectedRoom: any ){
        client.leave(selectedRoom);
    }
}