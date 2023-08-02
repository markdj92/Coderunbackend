const WebSocket1 = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');
const Y = require('yjs');

const rooms = new Map();

function getRoom(docName) {
  let room = rooms.get(docName);
  if (!room) {
    const ydoc = new Y.Doc();
    room = { ydoc, clients: new Set() };
    rooms.set(docName, room);
  }
  return room;
}

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

const wss = new WebSocket1.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  const docName = req.url.slice(1); // URL에서 문서 이름 추출
  const room = getRoom(docName);

  room.clients.add(ws);

  ws.on('close', () => {
    room.clients.delete(ws);
  });

  setupWSConnection(ws, req, {
    ydoc: room.ydoc
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(8000, () => {
  console.log(`WebSocket server running on port 8000`);
});
