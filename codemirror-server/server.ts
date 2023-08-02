/**
 * @type {any}
 */
const WebSocket1 = require('ws');
const http = require('http');
const wss = new WebSocket1.Server({ noServer: true });
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const rooms = new Map<string, any>();

function getRoom(nickname: string) {
  let room = rooms.get(nickname);
  if (!room) {
    const Y = require('yjs');
    const ydoc = new Y.Doc();
    room = {
      ydoc,
      clients: new Set(),
      // 여기에 추가로 방 관리에 필요한 데이터를 추가할 수 있음
    };
    rooms.set(nickname, room);
  }
  console.log('room', room.ydoc);
  return room;
}

const server = http.createServer((request: any, response: any) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

// wss.on('connection', setupWSConnection);
wss.on('connection', (ws: any, req: any) => {
	const docName = req.url.slice(1); // URL에서 문서 이름 추출
	const room = getRoom(docName);
	
	room.clients.add(ws);
	
	ws.on('close', () => {
		room.clients.delete(ws);
  });
  
  // y-websocket의 setupWSConnection을 사용하여 yjs와 연결 설정
  setupWSConnection(ws, {
    ydoc: room.ydoc
  });
});


server.on('upgrade', (request: any, socket: any, head: any) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit('connection', ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});


server.listen(8000, () => {
  console.log(`WebSocket server running at on port 8000`);
});