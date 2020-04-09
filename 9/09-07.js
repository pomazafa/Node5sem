let http = require('http');
let fs = require('fs');

let bound = 'smw60-smw60-smv60';
let body = '--' + bound + '\r\n';
	body += 'Content-Disposition:form-data; name="file"; filename="MyImage.png"\r\n';
	body += 'Content-Type:image/png\r\n\r\n';
	body += fs.readFileSync('C:\\Users\\User\\Desktop\\Node(ПСКП)\\9\\MyImage.png');
	body +='\r\n--' + bound + '--\r\n';


let options = {
	host: 'localhost',
	path: '/upload',
	port: 5000,
	method:'POST',
	headers:{'content-type':'multipart/form-data; boundary='+bound}
}

const req = http.request(options, (res) => {
	let data = '';
	res.on('data', (chunk) => {
		 data += chunk.toString('utf8');
	});
	res.on('end', () => {console.log('http.request: end: body = ', data);});
});

req.on('error', (e) => {console.log('http.request: error:', e.message);});

req.end(body);