let http = require('http');
const url = require('url');
const { graphql, buildSchema } = require('graphql');
const fs = require('fs');
const db = require('./db').DB;
const resolvers = require('./resolvers').Resolvers;

const graphqlSchema = buildSchema(fs.readFileSync('./schema.gql').toString());


let handler = (req, res) => {
    if (req.method === 'GET') {
        let pathUrl = url.parse(req.url, true).pathname.split('/');
        console.log(req.url);
        if (pathUrl[1] === "param") {
            let x = parseInt(pathUrl[2]);
            let y = parseInt(pathUrl[3]);
            if (Number.isInteger(x) && Number.isInteger(y)) {
                let sum = x + y;
                let sub = x - y;
                let mul = x * y;
                let o = x / y;
                pathUrl.forEach(el => res.write(el + '\n'))
                res.end('x + y = ' + sum +
                    ', x - y = ' + sub +
                    ', x * y = ' + mul +
                    ', x / y = ' + o);
            } else {
                res.end(req.url);
            }
        }
    } else
    if (req.method === 'POST') {
        let bodyStr = '';

        req.on('data', chunk => {
            bodyStr += chunk;
        });

        req.on('end', () => {
            graphql(graphqlSchema, bodyStr, resolvers, db).then(result => {
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(JSON.stringify(result));
            });
        });
    } else {
        res.writeHead(400, { 'Content-type': 'text/plain' });
        res.end('Bad request')
    }
}


let server = http.createServer();

server.listen(5000, (v) => { console.log('Running') })
    .on('error', (e) => { console.log('Error: ', e.code) })
    .on('request', handler);