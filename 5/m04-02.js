var util = require('util');
var ee = require('events');


var db_data = [
    { id: 1, name: 'Ivanova N.P.', bday: '1999-05-07' },
    { id: 2, name: 'Kolesnik E.A..', bday: '1998-10-08' },
    { id: 3, name: 'Lech A.B.', bday: '2000-11-12' }
];

function DB() {
    this.select = () => { return db_data; };
    this.insert = (r) => { db_data.push(r); };
    this.update = (r) => {
        let found = db_data.find((n) => n.id == r.id);

        if (found != undefined) {
            found.name = r.name;
            found.bday = r.bday;
        }

    };

    this.delete = (num) => {
        let found = db_data.find((n) => n.id == num);

        if (found != undefined) {
            db_data = db_data.filter(function(value, index, arr) {

                return value != found;

            });
        }

    };
    this.commit = () => {console.log('db.commit executed')};
}

util.inherits(DB, ee.EventEmitter);

module.exports.DB = DB;