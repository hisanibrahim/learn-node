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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// CRUD Operations

// Create, Read, Update, Delete

// POST, GET, PUT, DELETE
