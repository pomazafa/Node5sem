var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./m04-02');

var db = new data.DB();

let isStat = false;
let countRequest = 0;
let countCommit = 0;
let date1 = 0;
let date2 = 0;

db.on('GET', (req, res) => {
    console.log('DB.GET');
    if(isStat)
    	countRequest++;
    res.end(JSON.stringify(db.select()));
});
db.on('POST', (req, res) => {
    if(isStat)
    	countRequest++;
    console.log('DB.POST');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.insert(r);
        res.end(JSON.stringify(r));
    });
});
db.on('PUT', (req, res) => {
	if(isStat)
    	countRequest++;
    console.log('DB.PUT');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.update(r);
        res.end(JSON.stringify(r));
    });
});
db.on('DELETE', (req, res) => {
    console.log('DB.DELETE')
    if(isStat)
    	countRequest++;
    req.on('data', data => {
        let r = JSON.parse(data);
        db.delete(r.id);
        res.end(JSON.stringify(r));
    });
});
db.on('HEAD', (req, res) => {
    console.log('DB.COMMIT');
    db.commit();
    if(isStat)
    	countCommit++;
});


http.createServer(function(request, response) {
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);

    } else if (url.parse(request.url).pathname === '/api/db') {

        db.emit(request.method, request, response);
    }
    else if (url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, { 'Content-Type': 'application/json'});

    			response.end("{startTime: " + date1 + ", endTime: " + date2 + ", countCommit: " + countCommit + ", countRequest: " + countRequest + "}");
    }
}).listen(5000);


function Timeout(fn, interval) {
    var id = setTimeout(fn, interval);
    id.unref();
    this.cleared = false;
    this.clear = function() {
        this.cleared = true;
        clearTimeout(id);
    };
}

function Interval(fn, interval) {
    var id = setInterval(fn, interval);
    id.unref();
    this.cleared = false;
    this.clear = function() {
        this.cleared = true;
        clearInterval(id);
    };
}

function getTime() {
	var d = new Date();
	return d.getMinutes() + '.' + d.getSeconds();
}

let t = null;
let interv = null;
let timer = 0;
let r = () => {
    process.exit(0);
};


process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {

    let chunk = null;

    while ((chunk = process.stdin.read()) != null) {

        if (chunk.trim().indexOf('sd') != -1) {
            if (chunk.trim().slice(2).length != 0) {
                timer = Number(chunk.trim().slice(2).trim());

                t = new Timeout(r, timer);
            } else {
                if (t != null)
                    t.clear();
            }
        }


        if (chunk.trim().indexOf('sc') != -1) {
            if (chunk.trim().slice(2).length != 0) {
                timer = Number(chunk.trim().slice(2).trim());
                interv = new Interval(()=>{db.commit(); if(isStat)countCommit++}, timer);
            } else {
                if (interv != null)
                    interv.clear();
            }
        }


        if (chunk.trim().indexOf('ss') != -1) {
            if (chunk.trim().slice(2).length != 0) {
                timer = Number(chunk.trim().slice(2).trim());
                date1 = getTime();
                secondTime = new Timeout(()=>{date2 = getTime();}, timer)
                isStat = true;
            } else {

            	isStat = false;
            	countCommit = 0;
                countRequest = 0;

                if(!secondTime.cleared)
                	secondTime.clear();
            }
        }
    }
})