"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var state_1 = require("@codemirror/state");
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
//   const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello from separate Node.js server!\n');
//   });
//   server.listen(4000, () => {
//     console.log(`Server running on http://localhost:4000/`);
//   });
// }
// bootstrap();
var express = require('express');
var cors = require('cors');
var http = require('http');
var app = express();
app.use(cors());
var server = http.createServer(app);
app.get('/', function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
});
server.listen(3000, '127.0.0.1', function () {
    console.log('Server running at http://127.0.0.1:4000/');
});
var documents = new Map();
documents.set('', {
    updates: [],
    pending: [],
    doc: state_1.Text.of(['\n\n\nStarting doc!\n\n\n'])
});
var io = new socket_io_1.Server(server, {
    path: "/game",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
function getDocument(title) {
    if (documents.has(title))
        return documents.get(title);
    var documentContent = {
        updates: [],
        pending: [],
        doc: state_1.Text.of(["\n\n\nHello World from ".concat(title, "\n\n\n")])
    };
    documents.set(title, documentContent);
    return documentContent;
}
// listening for connections from clients
io.on('connection', function (socket) {
    socket.on('codingtest-join', function (title) {
        socket.join(title);
        console.log("Socket ".concat(socket.id, " joined room ").concat(title));
    });
    socket.on('pullUpdates', function (version, title) {
        try {
            var _a = getDocument(title), updates = _a.updates, pending_1 = _a.pending, doc = _a.doc;
            if (version < updates.length) {
                socket.emit("pullUpdateResponse", JSON.stringify(updates.slice(version)));
            }
            else {
                pending_1.push(function (updates) { socket.emit('pullUpdateResponse', JSON.stringify(updates.slice(version))); });
                documents.set(title, { updates: updates, pending: pending_1, doc: doc });
            }
        }
        catch (error) {
            console.error('pullUpdates', error);
        }
    });
    socket.on('pushUpdates', function (title, version, docUpdates) {
        try {
            var _a = getDocument(title), updates = _a.updates, pending_2 = _a.pending, doc = _a.doc;
            docUpdates = JSON.parse(docUpdates);
            if (version != updates.length) {
                socket.emit('pushUpdateResponse', false);
            }
            else {
                for (var _i = 0, docUpdates_1 = docUpdates; _i < docUpdates_1.length; _i++) {
                    var update = docUpdates_1[_i];
                    // Convert the JSON representation to an actual ChangeSet
                    // instance
                    var changes = state_1.ChangeSet.fromJSON(update.changes);
                    updates.push({ changes: changes, clientID: update.clientID, effects: update.effects });
                    documents.set(title, { updates: updates, pending: pending_2, doc: doc });
                    doc = changes.apply(doc);
                    documents.set(title, { updates: updates, pending: pending_2, doc: doc });
                }
                socket.emit('pushUpdateResponse', true);
                while (pending_2.length)
                    pending_2.pop()(updates);
                documents.set(title, { updates: updates, pending: pending_2, doc: doc });
            }
        }
        catch (error) {
            console.error('pushUpdates', error);
        }
    });
    socket.on('getDocument', function (title) {
        try {
            var _a = getDocument(title), updates = _a.updates, doc = _a.doc;
            socket.emit('getDocumentResponse', updates.length, doc.toString());
        }
        catch (error) {
            console.error('getDocument', error);
        }
    });
    socket.on('edit', function (params) {
        socket.emit('display', params);
    });
});
var port = process.env.PORT || 8000;
server.listen(port, function () { return console.log("Server listening on port: ".concat(port)); });
