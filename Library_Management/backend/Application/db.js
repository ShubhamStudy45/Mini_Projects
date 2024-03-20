const mysql2 = require('mysql2')
const pool = mysql2.createPool({
    host : '0.0.0.0',
    user : 'root',
    password : '1947',
    database : 'librarydb'
})

module.exports = pool