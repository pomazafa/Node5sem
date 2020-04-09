let k = 0;
let n  = 0;
const WebSocket = require('ws');

const wsserver = new WebSocket.Server({ port: 4000, host: 'localhost'});


wsserver.on('connection', (ws) => {
    ws.on('pong', (data) => {
        console.log('pong ' + data.toString());
        n++;
    })
    ws.on('message', message => {
        n = n + 1;
        console.log('client sent: ' + message.toString());
        ws.send(message);
    });
    setInterval(() => { 
    //ws.send('10-01 server: ' + ++k) 
    ws.ping('server: ping ');
    }, 5000);
})

setInterval(() => { 
        wsserver.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN)
                client.send('11-03 server: ' + ++k + '\n');
        });
    }, 15000);

setInterval(() => { 
    console.log(n + ' active clients');
    n = 0;
    }, 5000);

wsserver.on('error', (e) => { console.log('ws server error', e) });

console.log('ws server: host: ' + wsserver.options.host);
