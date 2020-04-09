const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

let name = process.argv[2];

ws.on('open', () => {
	ws.on('message', data => {console.log('on message: ', JSON.parse(data)); })

	setInterval(() => {ws.send(JSON.stringify({sender:name, date: new Date().toISOString()}));}, 3000)
})
