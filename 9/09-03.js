let http = require('http');
let query = require('querystring');

let parms = query.stringify({x:3, y:4, s:'xxx'});
let path = '/mypath';

console.log('path', path);
console.log('parms ', parms);
let options = {
	host: 'localhost',
	path: path,
	port: 5000,
	method:'POST'
}

const req = http.request(options, (res) => {

	console.log('http.request: response:', res.statusCode);
	console.log('http.request: statusMessage:', res.statusMessage);

	let data = '';
	res.on('data', (chunk) => {
		 data += chunk.toString('utf8');
	});
	res.on('end', () => {console.log('http.request: end: body = ', data);});
})

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.write(parms);

req.end();