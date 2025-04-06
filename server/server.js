const express = require("express");
const app = express();
const db = require("./db");


// routers imports
const meetingsRouter = require("./endpoints/meetings");
const usersRouter = require("./endpoints/users");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/meetings", meetingsRouter);
app.use("/api/users", usersRouter);

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
