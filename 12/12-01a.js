const fs = require('fs');
const WebSocket = require('ws');


const ws = new WebSocket('ws://localhost:4000/updates');

ws.on('open', () => {
    ws.on('message', message => {
        console.log('Received message => ' + message);
    })

});