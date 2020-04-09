let http = require('http');

let parms = '<request id = "28"> <x>1</x><x>2</x><m>a</m><m>b</m><m>c</m></request>';
let path = '/xml';

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
	res.on('end', () => {
            	let sum = 0;
            	let elemSum = 0;
            	let concat = 0;
            	let elemCon = 0;
                let rid = 0;
                let resid = 0;
                const htmlparser2 = require("htmlparser2");
                const parser = new htmlparser2.Parser({

                    onopentag(name, attribs) {
                        if (name === "request") {
                            rid = attribs.request;
                            resid = attribs.id;
                        }
                        if (name === "sum") {
                            sum = attribs.result;
                            elemSum = attribs.elememt;
                        }
                        if (name === "concat") {
                        	 concat = attribs.result;
                             elemCon= attribs.elememt;
                        }
                    },
                });
                parser.write(
                    data
                );
                parser.end();
                console.log('sum = ', sum);
            });
})

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.write(parms);

req.end();