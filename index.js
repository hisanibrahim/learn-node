const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/courses", (req, res) => {
  res.send([
    { id: 1, name: "hello" },
    { id: 2, name: "world" },
  ]);
});

app.listen(3000, () => console.log("Listening on port 3000..."));

// CRUD Operations

// Create, Read, Update, Delete

// POST, GET, PUT, DELETE
