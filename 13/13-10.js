const net = require('net');
const config = require('./config').tcp;

/*
const client = new net.Socket();
let buffer = Buffer.alloc(4);
let counter = 0;
client.connect(config.port, config.host, () => {
    let interval = setInterval(() => {
        client.write((buffer.writeInt32LE(counter++, 0), buffer));
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
});
client.on('data', data => {
    console.log('From server: ' + data.readInt32LE());
});
*/

/*
const client = new net.Socket();
let buffer = Buffer.alloc(4);
let counter = Number(process.argv[2]);
client.connect(config.port, config.host, () => {
    let interval = setInterval(() => {
        client.write((buffer.writeInt32LE(counter, 0), buffer));
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
});
client.on('data', data => {
    console.log('From server: ' + data.readInt32LE());
});
 */

/*
const counter = Number(process.argv[2]);
const port = Number(process.argv[3]);
const buffer = Buffer.alloc(4);
const client = new net.Socket();
client.connect(port, config.host, () => {
    setInterval(() => {
        client.write((buffer.writeInt32LE(counter, 0), buffer));
    }, 1000);
}).on('data', data => {
    console.log('From server: ' + data);
});
 */


const udpConfig = require('./config').udp;
const dgram = require('dgram');
const message = 'Message to udp server\0';
const client = dgram.createSocket('udp4');

client.send(message, 0, message.length, udpConfig.port, udpConfig.host, err => {
    if (err) {
        throw err;
    }
    console.log(`The message: "${message}" has been sent`);
});

client.on('message', message => {
    console.log(`Message from server: ${message}`);
    client.close();
});