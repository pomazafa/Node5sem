const http = require('http');
const url = require('url');
const fs = require('fs');
const EventEmitter = require('events');
const WebSocket = require('ws');

let wss = new WebSocket.Server({ host: 'localhost', port: 4000, path: '/updates' });
wss.on('connection', ws => {
    console.log('client connected');
});
wss.on('CHANGED', () => {
    wss.clients.forEach(ws => {
        console.log('asd');
        ws.send('CHANGED');
    });
});

// try {
//     fs.watch(dbFileName, (event, f) => {
//         if (f){
//             wss.clients.forEach(ws => {
//                 ws.send('StudentList.json changed');
//             });
//         }
//     });
//     fs.readdir('backup/', (err, files) => {
//         files.forEach(f => fs.watch(dbFileName, (event, f) => {
//             if (f) {
//                 wss.clients.forEach(ws => {
//                     ws.send('file in backup changed');
//                 });
//             }
//         }))
//     });
// } catch (e) {
//     //console.log('catch e = ', e.code);
// }

const dbFileName = 'StudentList.json';

const requestController = new EventEmitter();

function sendResponse(res, status, contentType, data) {
    res.writeHead(status, { 'Content-type': contentType });
    res.end(data);
}

requestController.on('GET', (req, res) => {
    let pathName = url.parse(req.url).pathname;
    let splittedPath = pathName.split('/');
    if (pathName == '/') {
        fs.readFile(dbFileName, (err, data) => {
            if (err) {
                sendResponse(res, 400, 'text/plain', err.message);
            } else {
                sendResponse(res, 200, 'application/json', data);
            }
        });
    } else if (pathName == '/client') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                sendResponse(res, 400, 'text/plain', err.message);
            } else {
                sendResponse(res, 200, 'text/html', data);
            }
        });
    } else if (pathName == '/backup') {
        fs.readdir('backup/', (err, files) => {
            sendResponse(res, 200, 'application/json', JSON.stringify(files));
        });
    } else if (splittedPath.length > 1 && splittedPath[0] == '') {
        let requestedIdx = parseInt(splittedPath[1]);
        if (isNaN(requestedIdx)) {
            sendResponse(res, 400, 'text/plain', 'Arguments error');
            return;
        }
        fs.readFile(dbFileName, (err, data) => {
            if (err) {
                sendResponse(res, 400, 'text/plain', err.message);
            } else {
                let dataObject = JSON.parse(data);
                for (const element in dataObject) {
                    if (dataObject[element].id == requestedIdx) {
                        sendResponse(res, 200, 'application/json', JSON.stringify(dataObject[element]));
                        return;
                    }
                }
                sendResponse(res, 400, 'text/plain', `No user with id ${requestedIdx}`);
            }
        });
    }
});

requestController.on('PUT', (req, res) => {
    let pathName = url.parse(req.url).pathname;
    if (pathName == '/') {
        let body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            let dataObject = JSON.parse(body);
            fs.readFile(dbFileName, (err, data) => {
                if (err) {
                    sendResponse(res, 400, 'text/plain', err.message);
                } else {
                    let fileObject = JSON.parse(data);
                    let found = false;
                    for (i in fileObject) {
                        if (fileObject[i].id == dataObject.id) {
                            found = true;
                            fileObject[i].id = dataObject.id;
                            fileObject[i].name = dataObject.name;
                            fileObject[i].bday = dataObject.bday;
                            fileObject[i].specility = dataObject.specility;
                            fs.writeFile(dbFileName, JSON.stringify(fileObject), (err) => {
                                if (err) {
                                    sendResponse(res, 400, 'text/plain', err.message);
                                } else {
                                    sendResponse(res, 200, 'application/json', JSON.stringify(dataObject));
                                }
                                wss.emit('CHANGED');
                            });
                            break;
                        }
                    };
                    if (!found) {
                        sendResponse(res, 400, 'text/plain', 'Student not exists');
                    }
                }
            });
        });
    }
});

requestController.on('DELETE', (req, res) => {
    let pathName = url.parse(req.url).pathname;
    let splittedPath = pathName.split('/')
    if (splittedPath.length > 2 && splittedPath[1] == 'backup') {
        try {
            let template = splittedPath[2];
            let regex = /^(\d{4})(\d{2})(\d{2})$/;
            let mached = template.match(regex);
            if (!mached) {
                throw new Error('Wrong template');
            } else {
                let requestedDate = new Date(`${mached[2]}-${mached[3]}-${mached[1]}`);
                if (isNaN(requestedDate.getTime()))
                    throw new Error('Invalid date');

                fs.readdir('backup/', { withFileTypes: true }, (err, fNames) => {
                    let listForDelete = [];
                    fNames.forEach(dirent => {
                        let fName = 'backup/' + dirent.name;
                        if (fs.statSync(fName).ctime <= requestedDate)
                            listForDelete.push(fName);
                    });
                    listForDelete.forEach(deletePath => {
                        fs.unlinkSync(deletePath);
                    });
                    sendResponse(res, 200, 'text/plain', `Year: ${mached[1]}; Month: ${mached[2]}; Day: ${mached[3]}; Date: ${requestedDate.toString()}; Files deleted:\n${listForDelete.join('\n')}`);
                });

            }
        } catch (e) {
            sendResponse(res, 400, 'text/plain', e.message);
        }
    } else if (splittedPath.length > 1 && splittedPath[0] == '') {
        let pickedIdx = parseInt(splittedPath[1]);
        if (isNaN(pickedIdx)) {
            sendResponse(res, 400, 'text/plain', 'Wrong argument');
            return;
        }
        fs.readFile(dbFileName, (err, data) => {
            if (err) {
                sendResponse(res, 500, 'text/plain', err.message);
                return;
            }
            let fileObject = JSON.parse(data);
            for (i in fileObject) {
                if (fileObject[i].id == pickedIdx) {
                    sendResponse(res, 200, 'application/json', JSON.stringify(fileObject[i]));
                    fileObject.splice(i, 1);
                    fs.writeFile(dbFileName, JSON.stringify(fileObject), (err) => {
                        wss.emit('CHANGED');
                        if (err)
                            console.log('write file error');
                    });
                    return;
                }
            }
            sendResponse(res, 400, 'text/plain', 'Invalid id');
        });
    }
});

requestController.on('POST', (req, res) => {
    let pathName = url.parse(req.url).pathname;
    if (pathName == '/') {
        let body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            let dataObject = JSON.parse(body);
            fs.readFile(dbFileName, (err, fdata) => {
                if (err) {
                    sendResponse(res, 400, 'text/plain', err.message);
                } else {
                    let fileObject = JSON.parse(fdata.toString('utf8').trim());
                    let found = false;
                    fileObject.forEach(element => {
                        if (element.id == dataObject.id) {
                            found = true;
                            return;
                        }
                    });
                    if (found) {
                        sendResponse(res, 400, 'text/plain', 'Student already exists');
                    } else {
                        fileObject.push(dataObject);
                        fs.writeFile(dbFileName, JSON.stringify(fileObject), (err) => {
                            if (err) {
                                sendResponse(res, 400, 'text/plain', err.message);
                            } else {
                                sendResponse(res, 200, 'application/json', JSON.stringify(dataObject));
                            }
                            wss.emit('CHANGED');
                        });
                    }
                }
            });
        });
    } else if (pathName == '/backup') {
        let currentDate = new Date();
        let fname = currentDate.getFullYear().toString() + (currentDate.getMonth() + 1) +
            currentDate.getDate() + currentDate.getHours() +
            currentDate.getMinutes() + '_' + dbFileName;
        setTimeout(() => {
            fs.copyFile(dbFileName, `backup/${fname}`, (err) => {
                if (err) {
                    sendResponse(res, 500, 'text/plain', err.message);
                } else {
                    sendResponse(res, 200, 'text/plain', `Created: ${fname}`);
                }
            });
        }, 2000);
    }
});

http.createServer((req, res) => {
    requestController.emit(req.method, req, res);
}).listen(3000);

console.log('Running http://localhost:3000');