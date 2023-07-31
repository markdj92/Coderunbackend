import { Server, Socket } from 'socket.io';
import {ChangeSet, Text} from "@codemirror/state"
import {Update} from "@codemirror/collab"

const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

// server.listen(3000, '127.0.0.1', () => {
//   console.log('Server running at http://127.0.0.1:3000/');
// });

interface document {
	updates: Update[],
	doc: Text,
	pending: ((value: any) => void)[],
}

let documents = new Map<string, document>();

documents.set('', {
	updates: [],
	pending: [],
	doc: Text.of(['\n\n\nStarting doc!\n\n\n'])
})

let io = new Server(server, {
	path: "/game",
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

function getDocument(title: string): document {
	if (documents.has(title)) return documents.get(title)!;
	const documentContent: document = {
		updates: [],
		pending: [],
		doc: Text.of([`Hello World! It's Codelearn!`])
	};
	documents.set(title, documentContent);
	return documentContent;
}

// listening for connections from clients
io.on('connection', (socket: Socket) => {
    
    socket.on('codingtest-join', (nickname: string) => {
	try {
		socket.join(nickname);
	} catch {
		return false;
	}
	console.log(`Socket ${socket.id} joined room ${nickname}`);
		return true;
    });

	socket.on('pullUpdates', ({version, nickname}) => {
		try {
			const { updates, pending, doc } = getDocument(nickname);
			if (version < updates.length) {
				socket.emit("pullUpdateResponse", JSON.stringify(updates.slice(version)))
			} else {
				pending.push((updates) => { socket.emit('pullUpdateResponse', JSON.stringify(updates.slice(version))) });
				documents.set(nickname, {updates, pending, doc})
			}
		} catch (error) {
			console.error('pullUpdates', error);
		}
	})

	socket.on('pushUpdates', ({ nickname, version, docUpdates }) => {
		try {
			let { updates, pending, doc } = getDocument(nickname);
			docUpdates = JSON.parse(docUpdates);
			if (version != updates.length) {
				socket.emit('pushUpdateResponse', false);
			} else {
				for (let update of docUpdates) {
					// Convert the JSON representation to an actual ChangeSet
					// instance
					let changes = ChangeSet.fromJSON(update.changes)
					updates.push({ changes, clientID: update.clientID, effects: update.effects })
					documents.set(nickname, {updates, pending, doc})
					doc = changes.apply(doc)
					documents.set(nickname, {updates, pending, doc})
				}
				socket.emit('pushUpdateResponse', true);

				while (pending.length) pending.pop()!(updates)
				documents.set(nickname, {updates, pending, doc})
			}
		} catch (error) {
			console.error('pushUpdates', error)
		}
	})

	socket.on('getDocument', ({ nickname }) => {
		try {
            let { updates, doc } = getDocument(nickname);
            
			socket.emit('getDocumentResponse', updates.length, doc.toString());
		} catch (error) {
			console.error('getDocument', error);
		}
	})
})

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server listening on port: ${port}`));
