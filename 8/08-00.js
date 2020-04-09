let http = require('http');
let m0800 = require('./m08-00.js');
const url = require('url');
let fs = require('fs');
let mp = require('multiparty')

let h = (r) => {
    let rc = '';
    for (key in r.headers) rc += '<h3>' + key + ':' + r.headers[key] + '</h3>';
    return rc;
}

let pathStatic;

let handler = (req, res) => {

    if (url.parse(req.url).pathname === '/connection') {
        console.log(req.url);
        if (typeof url.parse(req.url, true).query.set != 'undefined') {
            let k = parseInt(url.parse(req.url, true).query.set);
            if (Number.isInteger(k)) {
                server.keepAliveTimeout = k;
                res.end('server.keepAliveTimeout = ' + server.keepAliveTimeout.toString());
            }
        } else {
            res.end(server.keepAliveTimeout.toString())
        }
    }
    if (url.parse(req.url).pathname === '/headers') {

        console.log(req.url);
        let b = '';
        req.on('data', str => { b += str });

        res.setHeader("Content-Language", "en")

        res.setHeader("MyHeader", "HoHOHOHOHHHhohOHOhohh");

        let da = res.getHeaders();

        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });

        req.on('end', () => res.end(
            '<!DOCTYPE html> <html> <head></head>' +
            '<body>' +
            '<h1> HEADERS of Request</h1>' +
            h(req) +
            '<h1> HEADERS of Response</h1>' +
            JSON.stringify(da) +
            '</body>' +
            '</html>'
        ))
    }

    if (url.parse(req.url).pathname === '/parameter') {
        console.log(req.url);
        if (typeof url.parse(req.url, true).query.x != 'undefined' && typeof url.parse(req.url, true).query.y != 'undefined') {
            let x = parseInt(url.parse(req.url, true).query.x);
            let y = parseInt(url.parse(req.url, true).query.y);
            if (Number.isInteger(x) && Number.isInteger(y)) {
                let sum = x + y;
                let sub = x - y;
                let mul = x * y;
                let o = x / y;
                console.log('x + y = ' + sum +
                    ', x - y = ' + sub +
                    ', x * y = ' + mul +
                    ', x / y = ' + o);
                res.end('x + y = ' + sum +
                    ', x - y = ' + sub +
                    ', x * y = ' + mul +
                    ', x / y = ' + o);
            } else {
                res.end('Error. Parameter is not a number')
            }
        }
    } else {
        let pathUrl = url.parse(req.url, true).pathname.split('/');
        if (pathUrl[1] == 'parameter') {
            console.log(req.url);
            let x = parseInt(pathUrl[2]);
            let y = parseInt(pathUrl[3]);
            if (Number.isInteger(x) && Number.isInteger(y)) {
                let sum = x + y;
                let sub = x - y;
                let mul = x * y;
                let o = x / y;
                
                res.end('x + y = ' + sum +
                    ', x - y = ' + sub +
                    ', x * y = ' + mul +
                    ', x / y = ' + o);
            } else {
                res.end(req.url);
            }
        }
    }


    if (url.parse(req.url).pathname === '/close') {
        console.log(req.url);

        res.end('Server is closing');

        setTimeout(() => process.exit(0), 10000);
    }

    if (url.parse(req.url).pathname === '/socket') {
        console.log(req.url);

        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] ||
            req.connection.remoteAddress;
        res.end('Client ip ' + req.connection.remoteAddress + ', client port ' +
            req.connection.remotePort + ', server ip ' +
            req.connection.localAddress + ', server port ' +
            req.connection.localPort);
    }




    if (url.parse(req.url).pathname === '/req-data') {
        console.log(req.url);
        if (req.method == 'POST') {
            let ch = '';
            req.on('data', (data) => {
                ch += data;
            });
            req.on('end', () => {
                res.end(ch);
            });
        }
    }



    if (url.parse(req.url).pathname === '/resp-status') {
        console.log(req.url);
        if (typeof url.parse(req.url, true).query.code != 'undefined' && typeof url.parse(req.url, true).query.mess != 'undefined') {
            let code = parseInt(url.parse(req.url, true).query.code);
            let mess = url.parse(req.url, true).query.mess;
            if (Number.isInteger(code)) {
                res.status = code;
                res.statusMessage = mess;
            }
            res.end('Res.status: ' + res.status + ', res.message: ' + res.statusMessage);
        }
    }

    if (url.parse(req.url).pathname === '/formparameter') {
        console.log(req.url);
        if (req.method == 'GET') {
            let html = fs.readFileSync('./08-08.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        }
        if (req.method == 'POST') {
            let ch = '';
            req.on('data', (data) => {
                ch += data;
            });
            req.on('end', () => {
                res.end(ch);
            });
        }
    }


    if (url.parse(req.url).pathname === '/json') {
        console.log(req.url);
        if (req.method == 'POST') {
            let ch = "";
            req.on('data', (data) => {
                ch += data;
            });
            req.on('end', () => {
                let resObj = JSON.parse(ch);
                res.end("{ \"__comment\": \" Ответ ЛР8\", \"x_plus_y\":" + (resObj.x + resObj.y) + ", \"Concat_s_o\": \"" + resObj.s + " " + resObj.o.surname + "," + resObj.o.name + "\", \"Length_m\":" + resObj.m.length + "}");
            });
        }
    }



    if (url.parse(req.url).pathname === '/xml') {
        console.log(req.url);
        if (req.method == 'POST') {
            let ch = '';
            req.on('data', (data) => {
                ch += data;
            });
            req.on('end', () => {
                let isX = false;
                let isM = false;
                let isR = false;
                let xval = 0;
                let mval = "";
                let rid = 0;
                const htmlparser2 = require("htmlparser2");
                const parser = new htmlparser2.Parser({

                    onopentag(name, attribs) {
                        if (name === "request") {
                            rid = attribs.id;
                        }
                        if (name === "m") {
                            isM = true;
                        }
                        if (name === "x") {
                            isX = true;
                        }
                    },
                    ontext(text) {
                        if (isX) {
                            xval += +text.trim();
                        }
                        if (isM) {
                            mval += text.trim();
                        }
                    },
                    onclosetag(tagname) {
                        if (tagname === "x")
                            isX = false;
                        if (tagname === 'm')
                            isM = false;
                    }
                }, { decodeEntities: true });
                parser.write(
                    ch
                );
                parser.end();
                res.end("<response id =\"33\" request = \"" + rid + "\">	<sum element = \"x\" result=\"" + xval + "\">	<concat element = \"m\" result = \"" + mval + "\" /></request>");
            });
        }
    }


    if (url.parse(req.url).pathname === '/files') {
        console.log(req.url);

        const dir = './static';
        fs.readdir(dir, (err, files) => {
            res.setHeader("X-static-files-count", files.length.toString());

            res.end(files.length.toString());
        });
    } else {
        let pathUrl = url.parse(req.url, true).pathname.split('/');
        if (pathUrl[1] == 'files') {
            pathStatic = './static/' + pathUrl[2];
            if (isStatic('html', req.url)) sendFile(req, res, { 'Content-Type': 'text/html; charset=utf-8' });
            else if (isStatic('css', req.url)) sendFile(req, res, { 'Content-Type': 'text/css; charset=utf-8' });
            else if (isStatic('js', req.url)) sendFile(req, res, { 'Content-Type': 'text/javascript; charset=utf-8' });
            else if (isStatic('png', req.url)) sendFile(req, res, { 'Content-Type': 'image/png; charset=utf-8' });
            else if (isStatic('docx', req.url)) sendFile(req, res, { 'Content-Type': 'application/msword; charset=utf-8' });
            else if (isStatic('json', req.url)) sendFile(req, res, { 'Content-Type': 'application/json; charset=utf-8' });
            else if (isStatic('xml', req.url)) sendFile(req, res, { 'Content-Type': 'application/xml; charset=utf-8' });
            else if (isStatic('mp4', req.url)) sendFile(req, res, { 'Content-Type': 'video/mp4; charset=utf-8' });
            else if (isStatic('txt', req.url)) sendFile(req, res, { 'Content-Type': 'text/plain; charset=utf-8' });
            else writeHTTP404(res);
        }
    }

    if (url.parse(req.url).pathname === '/upload') {
        console.log(req.url);

        if (req.method === 'GET') {
            let html = fs.readFileSync('./08-14.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        } else if (req.method == 'POST') {
            let form = new mp.Form({ uploadDir: './static' });
            form.on('file', (name, file) => {});
            form.on('close', () => {
                res.writeHead(200, { 'Content-type': 'text/plain' });
                res.end("Uploaded!");
            });
            form.parse(req);
        }
    }
}

let server = http.createServer();

server.listen(5000, (v) => { console.log('Running') })
    .on('error', (e) => { console.log('Error: ', e.code) })
    .on('request', handler);




let isStatic = (ext, fn) => {
    let req = new RegExp('\\S*' + ext + '$');
    return req.test(fn);
};
let pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(pathStatic).pipe(res);
};

let sendFile = (req, res, headers) => {
    fs.access(pathStatic, fs.constants.R_OK, err => {
        if (err) this.writeHTTP404(res);
        else pipeFile(req, res, headers);
    });
};

let writeHTTP404 = (res) => {
    res.statusCode = 404;
    res.statusMessage = 'Resourse not found';
    res.end("Resourse not found");
};