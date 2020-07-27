const Joi = require("joi");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./logger");

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NODE_ENV: ${app.get("env")}`);

// express built-in middleware
app.use(express.json());
app.use(express.static("public"));

// user defined middleware
app.use(logger);

// third-party middleware
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("common"));
  console.log("Morgan enabled...");
}

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
