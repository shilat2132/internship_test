const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'meetingsApp'
});

db.connect((err) => {
  if (err) {
    console.error("Connection to MySQL database failed " + err.stack);
    return;
  }
  console.log("The database's connection id " + db.threadId);
});

module.exports = db;