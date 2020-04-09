const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;

// sum(square(3), square(5,4), mul(3,5,7,9,11,13))
// +fib(7)
// *mul(2,4,6)


let ws = new rpcWSC('ws://localhost:4000');

let t = 0;
let t2 = 0;

let h = () => async.waterfall([
			(cb) => {ws.call('square', [3]).catch((e) => cb(e, null)).then((r) => {t = r; console.log(r); cb(null, r)});},
			(p, cb) => {ws.call('square', [5, 4]).catch((e) => cb(e, null)).then((r) => {t2 = r; console.log(r); cb(null, r)});},
			(p, cb) => {ws.call('mul', [3,5,7,9,11,13]).catch((e) => cb(e, null)).then((r) => {console.log(r); cb(null, r)});},
			(p, cb) => {ws.call('sum', [p, t, t2]).catch((e) => cb(e, null)).then((r) => { t = r; console.log(r); cb(null, r)});},

			(p, cb) => {
        ws.login({ login: 'dpv', password: '123' })
        .then((login) => {
            if (login) ws.call('fib', [7]).catch((e) => cb(e, null)).then((r) => {console.log(r[0]); cb(null, r[0])});
            else cb({message1:'login error'}, null);
        })
    },

			(p, cb) => {ws.call('sum', [p, t]).catch((e) => cb(e, null)).then((r) => { t = r; console.log(r); cb(null, r)});},

			(p, cb) => {ws.call('mul', [2, 4, 6]).catch((e) => cb(e, null)).then((r) => {console.log(r); cb(null, r)});},

			(p, cb) => {ws.call('mul', [p, t]).catch((e) => cb(e, null)).then((r) => { console.log(r); cb(null, r)});},

	],
	(e, r) => {
		if(e) console.log('e = ', e);
		else console.log('r = ', r);
		ws.close();
	});

ws.on('open', h)