const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root8989',
  database: 'test',
})

db.connect(err => {
  if (err) {
    console.log('Error connecting to mySQl database', err)
  } else {
    console.log('Connected to mySql database')
  }
})

module.exports = db
