var url = require('url');

function Stat(sfn = './static') {
	this.STATIC_FOLDER = sfn;
    this.isStatic = (ext, fn) => {
        let req = new RegExp('\\S+.' + ext + '$');
        return req.test(fn);
    };
    let fs = require('fs');

    let pathStatic = (fn) => { return this.STATIC_FOLDER + fn; }

    let pipeFile = (req, res, headers) => {
        res.writeHead(200, headers);
        fs.createReadStream(pathStatic(req.url)).pipe(res);
    }

    this.sendFile = (req, res, headers) => {
        fs.access(pathStatic(url.parse(req.url).pathname), fs.constants.R_OK, err => {
            if (err) this.writeHTTP404(res);
            else pipeFile(req, res, headers);
        });
    }

    this.writeHTTP404 = (res) => {
        res.statusCode = 404;
        res.statusMessage = 'Resourse not found';
        res.end("Resourse not found");
    };

    this.writeHTTP405 = (res) => {
        res.statusCode = 405;
        res.statusMessage = 'Current type of request is not allowed';
        res.end("Current type of request is not allowed");
    };
}

module.exports = (parm) => { return new Stat(parm);}