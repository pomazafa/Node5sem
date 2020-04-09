const WebSocket = require('ws');

let k = 0;

let socket = new WebSocket('ws:/localhost:4000/wsserver');

socket.onopen = () => {
    console.log('socket.onopen');
    setInterval(() => { socket.send('10-01 client: ' + ++k); }, 3000);
};
socket.onclose = (e) => { console.log('socket.onclose' + e); }
socket.onmessage = message => {
    console.log('message = ' + message.data);
}
socket.onerror = function(error) { console.log("Error " + error.message); }