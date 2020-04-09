const net = require('net');

let HOST = '0.0.0.0';
let PORT1 = 40000;
let PORT2 = 50000;

let h = (n) => {return (sock) => {
	let sum = 0;

	console.log('Server CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

	sock.on('data', (data) => {
		console.log('Server DATA: ', data, sum);
		sum += data.readInt32LE();
	});

	let buf = Buffer.alloc(4);

	setInterval(()=> {buf.writeInt32LE(sum, 0); sock.write(buf)}, 5000);

	sock.on('close', (data) => {console.log('Server CLOSED: ', sock.remoteAddress + ' ' + sock.remotePort);});
	sock.on('error', (e) => {console.log('Server error: ', sock.remoteAddress + ' : ' + sock.remotePort)})

}}

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', () => {console.log('TCP-server ' + HOST + ':' + PORT1)});
net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', () => {console.log('TCP-server ' + HOST + ':' + PORT2)});

