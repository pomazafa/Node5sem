const net = require('net');
const config = require('./config').tcp;

/*
let controlSum = 0;
const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log(data, controlSum);
        controlSum += data.readInt32LE();
    });
    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);
    socket.on('close', () => clearInterval(interval));
});
server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
*/

/*
let clientCount = 0;
const server = net.createServer(socket => {
    let controlSum = 0;
    let clientId = clientCount++;
    console.log(`Client ${clientId} has been connected`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        controlSum += data.readInt32LE();
    });
    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        console.log(`Control sum for a client ${clientId}: ${controlSum}`);
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);
    socket.on('close', () => clearInterval(interval));
});
server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
 */

/*
let clientCount = 0;
function clientHandler(socket, port) {
    let clientId = clientCount++;
    console.log(`Client ${clientId} has been connected to the port of ${port}`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        socket.write(`ECHO: ${data.readInt32LE()}`);
    });
}
net.createServer(socket => clientHandler(socket, 40000)).listen(40000, config.host, () => {
    console.log(`Listening to ${config.host}:40000`);
});
net.createServer(socket => clientHandler(socket, 50000)).listen(50000, config.host, () => {
    console.log(`Listening to ${config.host}:50000`);
});
*/


const udpConfig = require('./config').udp;
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', () => {
    let address = server.address();
    console.log(`Listening to ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    const responseMessage = "ECHO: " + message;
    server.send(responseMessage, 0, responseMessage.length, remote.port, remote.address, err => {
        if (err) {
            throw err;
        }
        console.log(`The message: "${responseMessage}" has been sent`);
    });
});

server.bind(udpConfig.port, udpConfig.host);