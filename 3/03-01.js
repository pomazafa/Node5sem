const http = require('http');
const readline = require('readline');


var data = "norm";
var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('norm > ');
rl.prompt();



var server = http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    try {

        response.end(data);

        rl.on('line', function(line) {
            if (line === "exit") {
                rl.close();
            } else if (line == 'stop' || line == 'norm' || line == 'idle' || line == 'test') {
        		response.end(line);
        		data = line;
        		rl.setPrompt(data + ' > ');
        		rl.prompt();
            }
            else
            {
            	data = line;
            }

        }).on('close', function() {
            process.exit(0);
        });
    } catch (e) {
        console.error(e);
    }

});

server.listen(5000);
