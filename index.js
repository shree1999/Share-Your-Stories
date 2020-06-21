const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// passport and session
require("./config/passport")(passport);
app.use(
  session({
    secret: "Keyboard Cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// set global variable for logged in user
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//helpers
const {
  formateDate,
  stripTags,
  truncate,
  editIcons,
} = require("./helpers/hbs");

// handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formateDate, stripTags, truncate, editIcons },
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
  );
});
