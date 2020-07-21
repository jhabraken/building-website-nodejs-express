/* eslint-disable no-shadow */
const express = require("express");

const path = require("path");

// eslint-disable-next-line no-unused-vars
const { response } = require("express");

const cookieSession = require("cookie-session");

// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require("http-errors");

const bodyParser = require("body-parser");

const FeedbackService = require("./services/FeedbackService");

const SpeakerService = require("./services/SpeakerService");

const feedbackService = new FeedbackService("./data/feedback.json");

const speakerService = new SpeakerService("./data/speakers.json");

const routes = require("./routes");

const app = express();

const port = 3000;

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["Gherqweyu", "UI_p123nfg"],
  }),
);

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.locals.siteName = "ROUX Meetups";

app.use(express.static(path.join(__dirname, "./static")));

app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    // eslint-disable-next-line spaced-comment
    //console.log(response.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  "/",
  routes({
    feedbackService,
    speakerService,
  }),
);

app.use((request, response, next) => {
  return next(createError(404, "File not found"));
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  const status = err.status || 500;

  // Detail error in error log
  console.error(err);

  response.locals.status = status;
  response.status(status);
  response.render("error");
});

app.listen(port, () => {
  console.log(`Express is listening on port ${port}!`);
});
