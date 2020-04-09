const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

const async = require('async');

let h = (x=ws) => async.parallel({

    square3: (cb) => {ws.call('square', [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));},
    square5_4: (cb) => {ws.call('square', [5, 4]).catch((e) => cb(e, null)).then((r) => cb(null, r));},
    sum2: (cb) => { ws.call('sum', [2]).catch((e) => cb(e, null)).then((r) => cb(null, r));},
    sum2_4_6_8_10: (cb) => { ws.call('sum', [2, 4, 6, 8, 10]).catch((e) => cb(e, null)).then((r) => cb(null, r));},
    mul3: (cb) => { ws.call('mul', [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));},
    mul3_5_7_9_11_13: (cb) => { ws.call('mul', [3, 5, 7, 9, 11, 13]).catch((e) => cb(e, null)).then((r) => cb(null, r));},

    fib1: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fib', [1]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    },

    fib2: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fib', [2]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    },

    fib7: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fib', [7]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    },

    fact0: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fact', [0]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    },

    fact5: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fact', [5]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    },

    fact10: (cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fact', [10]).catch((e) => cb(e, null)).then((r) => cb(null, r));
            else cb({message1:'login error'}, null);
        })
    }
},
(e, r) => {
    if(e) console.log('e = ', e);
    else console.log('r = ', r);
    ws.close();
})

ws.on('open', h)
