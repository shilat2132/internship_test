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


const meetingsTableQuery = `
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Meeting',
  date DATE NOT NULL,
  start_hour TIME NOT NULL,
  end_hour TIME NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (start_hour < end_hour) -- Ensure start_hour is before end_hour
);
`;

db.query(meetingsTableQuery, (err, results) => {
  if (err) {
    console.error("Couldn't create a table", err);
  } 
});



const usersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);
`;

db.query(usersTableQuery, (err, results) => {
  if (err) {
    console.error("Couldn't create a table", err);
  } 
});

module.exports = db;