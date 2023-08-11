import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketProvider {
  private io: Server;

  initialize(server: any) {
    this.io = new Server(server, {
      path: '/canvas/',
      cors: { origin: '*' },
    });

    this.io.on('connection', this.onConnection);
  }

  private onConnection(socket: Socket) {
    console.log('connection');
    socket.on('joinRoom', function (roomKey) {
      socket.join(roomKey);
    });
    socket.on('drawing', function (data) {
      socket.to(data.roomKey).emit('drawing', data);
    });
    socket.on('disconnect', function () {
      console.log('disconnect');
    });
  }
}
