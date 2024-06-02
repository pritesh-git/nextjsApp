const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'pritesh',
  password: 'root8989',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool.promise()
