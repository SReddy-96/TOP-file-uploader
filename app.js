require("dotenv").config();

const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const favicon = require("serve-favicon");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const authenticateUser = require("./middleware/authenticate");
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const indexRouter = require("./routes/indexRouter");
const fileRouter = require("./routes/fileRouter");
const folderRouter = require("./routes/folderRouter");
const profileRouter = require("./routes/userRouter");

const app = express();

// Serve Favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// views assets
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// require Auth middleware
require("./middleware/passport");

// initialising the session
app.use(passport.session());

// middleware to store the user to locals
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use("/", loginRouter);
app.use("/register", registerRouter);

// middleware to protect the below pages 
app.use(authenticateUser);

app.use("/home", indexRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);
app.use('/profile', profileRouter)

// logout route
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log("404 for:", req.originalUrl);
  const err = new Error("Page not found");
  err.statusCode = 404;
  next(err); // Pass to error handler
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).render("error", {
    title: "Error",
    err: err,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
