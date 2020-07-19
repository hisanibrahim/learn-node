const express = require("express");
const app = express();

// CRUD Operations

// Create, Read, Update, Delete

// POST, GET, PUT, DELETE

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/courses", (req, res) => {
  res.send([
    { id: 1, name: "hello" },
    { id: 2, name: "world" },
  ]);
});

// Route parameters
app.get("/api/courses/:id", (req, res) => {
  res.send(req.params);
});

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

// Query string parameters

app.get("/api/posts", (req, res) => {
  // http://localhost:3000/api/posts?name=hisan&age=24
  res.send(req.query);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
