var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./m04-02');

var db = new data.DB();

db.on('GET', (req, res) => {console.log('DB.GET'); res.end(JSON.stringify(db.select()));});
db.on('POST', (req, res) => {console.log('DB.POST');
			req.on('data', data=> {
				let r = JSON.parse(data);
				db.insert(r);
				res.end(JSON.stringify(r));
			});
		});
db.on('PUT', (req, res) => {console.log('DB.PUT');
			req.on('data', data=> {
				let r = JSON.parse(data);
				db.update(r);
				res.end(JSON.stringify(r));
			});
		});
db.on('DELETE', (req, res) => {console.log('DB.DELETE')
		req.on('data', data=> {
				let r = JSON.parse(data);
				db.delete(r.id);
				res.end(JSON.stringify(r));
			});
});


http.createServer(function(request, response) {
	if(url.parse(request.url).pathname === '/'){
		let html = fs.readFileSync('./index.html');
		response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
		response.end(html);

	}
	else if (url.parse(request.url).pathname === '/api/db'){

		db.emit(request.method, request, response);
	}
}).listen(5000);