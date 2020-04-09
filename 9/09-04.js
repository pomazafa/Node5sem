let http = require('http');

let parms = JSON.stringify({__comment:'Запрос лаба 9', x:1, y:2, s:'message', m:['a','b','c','d'], o:{surname:'Duben', name:'Polina'}});
let path = '/json';

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
	//res.on('end', () => {console.log('http.request: end: body = ', data);});
	res.on('end', () => {console.log('http.request: end: x + y = ', JSON.parse(data).x_plus_y);});
})

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.write(parms);

req.end();