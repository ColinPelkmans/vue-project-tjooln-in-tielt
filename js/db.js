/*jshint esversion: 6 */

const mysql = require('mysql');

let tableName = "";
const pool = mysql.createPool({                           //creates pool with given variables in mysql
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scribble'
});

exports.setTable = table => {                    //expects string table, changes the currently used table
    tableName = table;
};

exports.query = query => {                       //expects a valid mysql query in string format
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) throw err;
            console.log(`query ${query} sent`);
            console.log(rows);
            return rows;
        });
    });
};

exports.insert = values => {                     //expects an object with key value pairs where each key corresponds to the name of the column
    let queryStart = `INSERT INTO ${tableName} (`;
    let queryEnd = ') VALUES (';

    for (let [key, value, index] of Object.entries(values)) {
        queryStart = queryStart.concat(key);
        if (typeof value == "string") {
            queryEnd = queryEnd.concat(`"${value}"`);
        } else {
            queryEnd = queryEnd.concat(value);
        }

        if (index != values.length) {
            queryStart = queryStart.concat(',');
            queryEnd = queryEnd.concat(',');
        } else {
            queryEnd = queryEnd.concat(')');
        }
    }

    const query = queryStart + queryEnd;

    exports.query(query);
};

exports.delete = id => {                       //expects an integer id that refers to the table entry that will be deleted
    exports.query(`DELETE FROM ${tableName} WHERE id = ${id}`);
    console.log(`deleted entry ${id} from ${tableName}`);
};

exports.wipe = () => {                           //wipes all the entries in the table
    exports.query(`DELETE FROM ${tableName}`);
    console.log(`wiped table ${tableName}`);
};

exports.getRecord = id => //expects an integer id, will return the record from the currently selected table that corresponds to this id
exports.query(`SELECT * FROM ${tableName} WHERE id = ${id}`);