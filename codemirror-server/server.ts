import { Server, Socket } from 'socket.io';
import {ChangeSet, Text} from "@codemirror/state"
import {Update} from "@codemirror/collab"



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

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:4000/');
});


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
		doc: Text.of([`\n\n\nHello World from ${title}\n\n\n`])
	};

	documents.set(title, documentContent);

	return documentContent;
}

// listening for connections from clients
io.on('connection', (socket: Socket) => {
    
    socket.on('codingtest-join', (title: string) => {
	try {
		socket.join(title);
	} catch {
		return false;
	}
		
	console.log(`Socket ${socket.id} joined room ${title}`);
		return true;
    });

	socket.on('pullUpdates', ({version, title}) => {
		try {
			const { updates, pending, doc } = getDocument(title);

			if (version < updates.length) {
				socket.emit("pullUpdateResponse", JSON.stringify(updates.slice(version)))
			} else {
				pending.push((updates) => { socket.emit('pullUpdateResponse', JSON.stringify(updates.slice(version))) });
				documents.set(title, {updates, pending, doc})
			}
		} catch (error) {
			console.error('pullUpdates', error);
		}
	})

	socket.on('pushUpdates', ({ title, version, docUpdates }) => {
		try {
			let { updates, pending, doc } = getDocument(title);
			docUpdates = JSON.parse(docUpdates);
			console.log(docUpdates);
			if (version != updates.length) {
				socket.emit('pushUpdateResponse', false);
			} else {
				for (let update of docUpdates) {
					// Convert the JSON representation to an actual ChangeSet
					// instance
					let changes = ChangeSet.fromJSON(update.changes)
					updates.push({ changes, clientID: update.clientID, effects: update.effects })
					documents.set(title, {updates, pending, doc})
					doc = changes.apply(doc)
					documents.set(title, {updates, pending, doc})
				}
				socket.emit('pushUpdateResponse', true);

				while (pending.length) pending.pop()!(updates)
				documents.set(title, {updates, pending, doc})
			}
		} catch (error) {
			console.error('pushUpdates', error)
		}
	})

	socket.on('getDocument', ({ title }) => {
		try {
            let { updates, doc } = getDocument(title);
            
			socket.emit('getDocumentResponse', updates.length, doc.toString());
		} catch (error) {
			console.error('getDocument', error);
		}
	})

	// socket.on('edit', (params) => {
	// 	socket.emit('display', params);
	// })
})

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server listening on port: ${port}`));
