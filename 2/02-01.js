const http = require('http');
var fs = require('fs');

function htmlPage(req, res) {
  res.setHeader('Content-Type', 'text/html');
  var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
  myReadStream.pipe(res);
}

function pngPage(req, res) 
{

	let png = null;

	fs.stat('./pic.png', (err, stat)=>{
		if(err){console.log('error:', err);}
		else{
  			png = fs.readFileSync('./pic.png'); 

  			res.writeHead(200, {'Content-Type' : 'image/png', 'Content-Length':stat.size
  		});
		res.end(png, 'binary');
			}
	});
}

function namePage(req, res) 
{
  res.setHeader('Content-Type', 'text/plain');
  	var myReadStream = fs.createReadStream(__dirname + '/name.txt', 'utf-8');
  	myReadStream.pipe(res);
}

function xmlHttpPage(req, res) 
{
	res.setHeader('Content-Type', 'text/html');
  	var myReadStream = fs.createReadStream(__dirname + '/xmlhttprequest.html', 'utf-8');
  	myReadStream.pipe(res);
}

function fetchPage(req, res) 
{
	res.setHeader('Content-Type', 'text/html');
  	var myReadStream = fs.createReadStream(__dirname + '/fetch.html', 'utf-8');
  	myReadStream.pipe(res);
}

function jqueryPage(req, res) 
{
	res.setHeader('Content-Type', 'text/html');
  	var myReadStream = fs.createReadStream(__dirname + '/jquery.html', 'utf-8');
  	myReadStream.pipe(res);
}

var server = http.createServer(function(request, response) {
  	if (request.url === '/html') 
  	{
  	htmlPage(request, response);
	}
  	else if (request.url === '/png') 
  		{
  			pngPage(request, response);
		}
		else if (request.url === '/api/name') 
  		{
  			namePage(request, response);
		}
			else if (request.url === '/xmlhttprequest') 
  			{
  				xmlHttpPage(request, response);
			}
				else if (request.url === '/fetch') 
  				{
  					fetchPage(request, response);
				}
					else if (request.url === '/jquery') 
  					{
  						jqueryPage(request, response);
					}
		
});

server.listen(5000);
console.log('Running');
