let http = require('http');
const url = require('url');


let handler = (req, res) => {
	if (url.parse(req.url).pathname === '/mypath') {
        console.log(req.url);
        if (req.method == 'POST') {
            let ch = "";
            req.on('data', (data) => {
                ch += data;
            });
            req.on('end', () => {
                console.log(ch);

                let x = parseInt(url.parse(req.url + '?' + ch, true).query.x);
            	let y = parseInt(url.parse(req.url + '?' + ch, true).query.y);
            	let s = url.parse(req.url + '?' + ch, true).query.s;

                res.end(x + ' ' + y + ' ' + s);

            });
        }
    }
};

let server = http.createServer();

server.listen(5000, (v) => { console.log('Running') })
    .on('error', (e) => { console.log('Error: ', e.code) })
    .on('request', handler);