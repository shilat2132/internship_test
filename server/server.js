const express = require("express");
const app = express();
const db = require("./db"); // Import the database connection
const meetingsRouter = require("./endpoints/meetings");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS meetings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Meeting',
  date DATE NOT NULL,
  hour TIME NOT NULL
);
`;

db.query(createTableQuery, (err, results) => {
  if (err) {
    console.error("Couldn't create a table", err);
  } else {
    console.log("Table was created successfully");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/meetings", meetingsRouter);

process.on('SIGINT', () => {
  console.log("Closing database connection...");
  db.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0); // Exit the process
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
