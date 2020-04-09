const http = require('http');
const {graphql, buildSchema} = require('graphql');
const fs = require('fs');
const db = require('./db').DB;
const resolvers = require('./resolvers').Resolvers;

const graphqlSchema = buildSchema(fs.readFileSync('./schema.gql').toString());

http.createServer((req, res) => {
    if (req.method === 'POST') {
        let collectedBody = '';
    
        req.on('data', chunk => {
            collectedBody += chunk;
        });

        req.on('end', () => {
            graphql(graphqlSchema, collectedBody, resolvers, db).then(result => {
                res.writeHead(200, {'Content-type': 'application/json'});
                res.end(JSON.stringify(result));
            });
        });
    } else {
        res.writeHead(400, {'Content-type': 'text/plain'});
        res.end('Bad request')
    }
}).listen(3000);

console.log('Server started at http://127.0.0.1:3000');