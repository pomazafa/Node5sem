let http = require('http');
let query = require('querystring');

let parms = query.stringify({x:3, y:4});
let path = '/parameter?' + parms;

console.log('parms', parms);
console.log('path', path);

let options = {
	host: 'localhost',
	path: path,
	port: 5000,
	method:'GET'
}

const req = http.request(options, (res) => {

	console.log('http.request: response:', res.statusCode);
	console.log('http.request: statusMessage:', res.statusMessage);

	let data = '';
	res.on('data', (chunk) => {
		console.log('http.request: data: body = ', data += chunk.toString('utf8'));
	});
	res.on('end', () => {console.log('http.request: end: body = ', data);});
})

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.end();
