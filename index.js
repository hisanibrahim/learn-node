const Joi = require("joi");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger = require("./logger");

const app = express();

// get config based on NODE_ENV
console.log(`App Name : ${config.get("name")}`);
console.log(`Mail : ${config.get("mail.host")}`);

// password stored in env variable
// created custom-environment-variables.json for maping the same
// include only keys that store in env_variable
// like sensitive information

// console.log(`Password : ${config.get("mail.password")}`);

// express built-in middleware
app.use(express.json());
app.use(express.static("public"));

// user defined middleware
app.use(logger);

// third-party middleware
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("common"));

  // set DEBUG=app:startup
  // set DEBUG=app:startup,app:db
  // set DEBUG=app:*

  startupDebugger("Morgan enabled...");
  // console.log();
}

// some db code

dbDebugger("Connected to Database");

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);

  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);

  if (!course) return res.status(404).send("Course not found");

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;

  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);

  if (!course) return res.status(404).send("Course not found");

  const index = courses.indexOf(course);

  courses.splice(index, 1);

  res.send(courses);
});

const validateCourse = (course) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
};

const getCourse = (id) => {
  return courses.find((course) => course.id === parseInt(id));
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
