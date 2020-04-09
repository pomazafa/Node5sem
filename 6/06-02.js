const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
const htmlUrl = '/mailer';
const targetFile = './mailer.html';

let server = http.createServer((request, response) => {

  if (request.url === htmlUrl) {
    fs.readFile(targetFile, (err, data) => {
      if (err) {
        console.error(err);
        response.statusCode = (err.code === 'ENOENT') ? 404 : 500;
        response.end();
      }

      response.writeHead(
        200,
        {
          'Content-Type': 'text/html',
          'Content-Length': data.length,
        });
      response.end(data);
    });
  } else {
    response.statusCode = 404;
    response.end();
  }
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
