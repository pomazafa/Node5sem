const db = require('oracledb');

const dbconf = {
    user: 'system',
    password: 'pomazafaP1',
    connectString: '//localhost/orcl'
}

let connection;
console.log('Connecting to database...');
db.getConnection(dbconf).then(result => {
    connection = result;
    console.log('Database connected');
}).catch(err => {
    console.error(`DB connection error ${err.message}`);
})

exports.DB = {
    getAll: async function () {
        console.log('getAll');
        let resultSet = await connection.execute('SELECT * FROM table1');
        let result = [];
        for (let row of resultSet.rows) {
            result.push({
                x: row[0],
                y: row[1]
            });
        }
        return result;
    },

    getOne: async function (x) {
        console.log('getOne');
        let resultSet = await connection.execute('SELECT * FROM table1 WHERE x = ' + x);
        if (resultSet.rows.length === 0)
            return null;
        else
            return {
                x: resultSet.rows[0][0],
                y: resultSet.rows[0][1]
            }
    }
}