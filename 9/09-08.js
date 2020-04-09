const http = require('http');
const fs = require('fs');

const file = fs.createWriteStream('1.txt');

let options = {
	host:'localhost',
	path:'/files/1.txt',
	port:5000,
	method:'GET'
}

const req = http.request(options, (res) => {res.pipe(file);});

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.end();