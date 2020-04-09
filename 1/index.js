const http = require('http');

const server = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/HTML'})
    res.end('<h1>Hello world!</h1>\n' + 'url: ' + req.url + '<br/>Method: ' 
    	+ req.method + '<br/>Host: ' + req.headers['host']);
});

server.listen(2000, '127.0.0.1', () => {
    console.log('Running');
});