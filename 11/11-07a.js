const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

let k = 0;

ws.on('open', () => {

	setInterval(() => ws.notify('A', {n:++k, x:1, y:2}), 1000);
	setInterval(() => ws.notify('B', {n:++k, x:1, y:2}), 5000);
	setInterval(() => ws.notify('C', {n:++k, x:1, y:2}), 3000);
})