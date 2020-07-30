const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");

const logger = require("./middleware/logger");

const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // default

// get config based on NODE_ENV
console.log(`App Name : ${config.get("name")}`);

// express built-in middleware
app.use(express.json());
app.use(express.static("public"));

// user defined middleware
app.use(logger);

// third-party middleware
app.use(helmet());

// each endpoints to respective Router
app.use("/", home);
app.use("/api/courses", courses);

// morgan enabled only in development
if (app.get("env") === "development") {
  app.use(morgan("common"));
  debug("Morgan enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
