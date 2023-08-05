const WebSocket1 = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');
const Y = require('yjs');

// 변경한 부분: Y.Doc()을 사용해 공유 문서를 생성하고 'rooms' 키에 맵을 연결합니다.
const ydoc = new Y.Doc();
const rooms = ydoc.getMap('rooms');

function getRoom(docName) {
  let room = rooms.get(docName);
  if (!room) {
    const roomYdoc = new Y.Doc();
    room = { ydoc: roomYdoc, clients: new Set() };
    rooms.set(docName, room);
  }
  return room;
}

const server = http.createServer((request, response) => {
  const docName = request.url.slice(1);
  if (rooms.has(docName)) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ docName }));
  } else {
    response.writeHead(404);
    response.end('Document not found');
  }
});

const wss = new WebSocket1.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  const docName = req.url.slice(1);
  const room = getRoom(docName);
  room.clients.add(ws);

  ws.on('close', () => {
    room.clients.delete(ws);
  });

  setupWSConnection(ws, req, { ydoc: room.ydoc });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(8000, () => {
  console.log(`WebSocket server running on port 8000`);
});
