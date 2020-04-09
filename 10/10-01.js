const httpserver = require('http').createServer((req, res) => {
    if (req.method == 'GET' && req.url == '/start') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(require('fs').readFileSync('./10-01http.html'));
    } else {
        writeHTTP400(res);
    }
});

httpserver.listen(3000);

console.log('httpserver: 3000');

let k = 0;

const WebSocket = require('ws');

const wsserver = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' });

let n = 0;

wsserver.on('connection', (ws) => {
    ws.on('message', message => {
        console.log('Received message => ' + message)
        var ar = message.split(' ');
        n = ar[ar.length - 1];
    })
    setInterval(() => { ws.send('10-01 server: ' + n + '->' + ++k) }, 5000);
})

wsserver.on('error', (e) => { console.log('ws server error', e) });

console.log('ws server: host: ' + wsserver.options.host + ', port: ' + wsserver.options.port + ', path: ' + wsserver.options.path);


let writeHTTP400 = (res) => {
    res.statusCode = 400;
    res.statusMessage = 'Method is not available';
    res.end("Method is not available");
};