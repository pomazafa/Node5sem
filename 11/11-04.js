const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000, host: 'localhost'});

wss.on('connection', ws => {
	ws.on('message', data => {console.log('on message: from ', JSON.parse(data).sender )});

	let k = 0;

	setInterval(() => {ws.send(JSON.stringify({k:++k, date: new Date().toISOString()}));}, 5000);	
})