var WebSocket1 = require('ws');
var http = require('http');
var setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
var Y = require('yjs');
// 변경한 부분: Y.Doc()을 사용해 공유 문서를 생성하고 'rooms' 키에 맵을 연결합니다.
var ydoc = new Y.Doc();
var rooms = ydoc.getMap('rooms');
function getRoom(docName) {
    var room = rooms.get(docName);
    if (!room) {
        var roomYdoc = new Y.Doc();
        room = { ydoc: roomYdoc, clients: new Set() };
        rooms.set(docName, room);
    }
    return room;
}
var server = http.createServer(function (request, response) {
    var docName = request.url.slice(1);
    if (rooms.has(docName)) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ docName: docName }));
    }
    else {
        response.writeHead(404);
        response.end('Document not found');
    }
});
var wss = new WebSocket1.Server({ noServer: true });
wss.on('connection', function (ws, req) {
    var docName = req.url.slice(1);
    var room = getRoom(docName);
    room.clients.add(ws);
    ws.on('close', function () {
        room.clients.delete(ws);
    });
    setupWSConnection(ws, req, { ydoc: room.ydoc });
});
server.on('upgrade', function (request, socket, head) {
    wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request);
    });
});
server.listen(8000, function () {
    console.log("WebSocket server running on port 8000");
});
