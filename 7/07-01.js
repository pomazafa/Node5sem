let http = require('http');
let stat = require('./m07-01.js')('./static');
let fs = require('fs');
var url = require('url');

let GET_handler = (req, res) => {
	if(url.parse(req.url).pathname === '/')
	{
        let html = fs.readFileSync('./07-01.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    }
    else
	if      (stat.isStatic('html', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/html; charset=utf-8'});
	else if (stat.isStatic('css', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/css; charset=utf-8'});
	else if (stat.isStatic('js', req.url)) stat.sendFile(req, res, {'Content-Type': 'text/javascript; charset=utf-8'});
	else if (stat.isStatic('png', req.url)) stat.sendFile(req, res, {'Content-Type': 'image/png; charset=utf-8'});
	else if (stat.isStatic('docx', req.url)) stat.sendFile(req, res, {'Content-Type': 'application/msword; charset=utf-8'});
	else if (stat.isStatic('json', req.url)) stat.sendFile(req, res, {'Content-Type': 'application/json; charset=utf-8'});
	else if (stat.isStatic('xml', req.url)) stat.sendFile(req, res, {'Content-Type': 'application/xml; charset=utf-8'});
	else if (stat.isStatic('mp4', req.url)) stat.sendFile(req, res, {'Content-Type': 'video/mp4; charset=utf-8'});
	else stat.writeHTTP404(res);

};

let http_handler = (req, res) => {
	switch (req.method) {
		case 'GET' : GET_handler(req, res); break;
		default : stat.writeHTTP405(res); break;
	}	
};

let server = http.createServer(function(request, response) {

});

server.on('request', http_handler);

server.listen(5000);