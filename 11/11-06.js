const rpcWSS = require('rpc-websockets').Server;
const readline = require('readline');

var rl = readline.createInterface(process.stdin, process.stdout);

let k = 0;

let server = new rpcWSS({ port: 4000, host: 'localhost' });

server.event('A');
server.event('B');
server.event('C');


rl.on('line', function(line) {
    if (line === "exit") {
        rl.close();
    } else if (line == 'A'){

    	server.emit('A', { n: ++k, x: 1, y: 2 });
    } 
    else if (line == 'B'){

    	server.emit('B', { n: ++k, s: "Hello, I am B" });
    } 
    else if (line == 'C'){

    	server.emit('C', { n: ++k });
    } 

}).on('close', function() {
    process.exit(0);
});