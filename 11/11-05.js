const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({ port: 4000, host: 'localhost' });

server.setAuth((l) => {return(l.login == 'dpv' && l.password == '123')})

let fibarr = [];

var fib = (n) => { return (n < 2 ? n : fib(n - 1) + fib(n - 2)); }

function fact(n) {
  return (n != 1) ? n * fact(n - 1) : 1;
}

server.register('sum', params =>{ if(params[1] == null) return params[0]; else {
	let m = 0;
	params.forEach(p => m+=p)
	return m}}).public();

server.register('square', (r) => { if(r[1] == null) return Math.PI * r * r; else return r[0] * r[1] }).public();

server.register('mul', (params) => { if(params[1] == null) return params[0]; else {
	let m = 1;
	params.forEach(p => m*=p)
	return m} }).public();

server.register('fib', (param) => {
            fibarr = [];
            while (param[0] > 0) {
                fibarr.push(fib(param[0])); param[0]--;
                }
                return fibarr;
            }).protected();

server.register('fact', (param) => {
			if(param > 0)
            	return fact(param);
            else return 1;
            }).protected();
