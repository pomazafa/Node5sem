const http = require('http');
const url = require('url');
const fs = require('fs');

// var fib = (n) => {return (n < 2? n:fib(n-1) + fib(n-2));}

// function Fib(n, cb) {
// 	this.fn = n;
// 	this.ffib = fib;
// 	this.fcb = cb;
// 	this.calc = () => {process.nextTick(() => {this.fcb(null, this.ffib(this.fn));});}
// }


// http.createServer(function(request, response) {

// 	let rc = JSON.stringify({k:0, fib:0});

// 	if(url.parse(request.url).pathname === '/fact') {
// 		console.log(request.url);
// 		if(typeof url.parse(request.url, true).query.k != 'undefined'){
// 			let k = parseInt(url.parse(request.url, true).query.k);
// 			if(Number.isInteger(k)){
// 				response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
// 				let fib = new Fib(k, (err, result) => {response.end(JSON.stringify({k:k, fib:result}));});
// 				fib.calc();
// 			}
// 		}
// 	}
// }).listen(5000);



let factorial = (n) => {
  return (n != 1) ? n * factorial(n - 1) : 1;
}


function Fact(n, cb) {
	this.k = n;
	this.fact = factorial;
	this.fcb = cb;
	//this.calc = () => {process.nextTick(() => {this.fcb(null, this.fact(this.k));})}
	this.calc = () => {setImmediate(() => {this.fcb(null, this.fact(this.k));})}
}


var server = http.createServer(function(request, response) {
	let rc = JSON.stringify({k: 0});

	if(url.parse(request.url).pathname === '/fact') {
		console.log(request.url);
		if(typeof url.parse(request.url, true).query.k != 'undefined'){
			let k = parseInt(url.parse(request.url, true).query.k);
			if(Number.isInteger(k)){
				response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
				//response.end(JSON.stringify({k:k, fact:factorial(k)}))
				let factor = new Fact(k, (err, result) => {response.end(JSON.stringify({k:k, fact:result}));})
				factor.calc();
			}
		}
	}
	else if(url.parse(request.url).pathname =='/'){
		let html = fs.readFileSync('./index.html');
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(html);
	}
});

server.listen(5000);
console.log('Running');