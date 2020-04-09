const WebSocket = require('ws');

let k = 0;

let ws = new WebSocket('ws://localhost:4000');

const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});

duplex.pipe(process.stdout);

process.stdin.pipe(duplex);

ws.on('ping', data => {
	console.log(' on ping: ' + data);
})
