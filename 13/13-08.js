const net = require('net');

const HOST = '127.0.0.1';

const PORT = process.argv[2] ? process.argv[2] : 40000;

let buf = new Buffer.alloc(4);
let client = new net.Socket();

client.connect(PORT, HOST, () => {

    console.log('Client CONNECTED: ', client.remoteAddress + ' ' + client.remotePort);
        let k = 0;
        timerID = setInterval(() => { client.write((buf.writeInt32LE(k++, 0), buf)) }, 1000);
        setTimeout(() => {
            clearInterval(timerID);
            client.end();
        }, 20000);
})

client.on('data', (data) => { console.log('Client DATA: ', data.readInt32LE()) });

client.on('close', () => { console.log('Client CLOSE'); });

client.on('error', (e) => { console.log('Client ERROR', e); });