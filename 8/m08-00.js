const isJson = (headers, header, mime) => {
	let rc = false;
	let h = headers[header];
	if (h) rc = h.indexOf(mime) >= 0;
	return rc;
}

module.exports.write400 = (res, smess) => {
		console.log(smess);
		res.writeHead(400, {'Content-Type': 'text/html;charset=utf-8'});
		res.statusMessage = smess;
		res.end();
}

module.exports.write200 = (res, smess, mess) => {
	console.log(smess, mess);
	res.writeHead(400, {'Content-Type': 'text/html;charset=utf-8'});
	res.statusMessage = smess;
	res.end(mess);
}

module.exports.isJsonContentType = (hs) => isJson(hs, 'content-type', 'application/json');
module.exports.isJsonAccept = (hs) => isJson(hs, 'accept', 'application/json');