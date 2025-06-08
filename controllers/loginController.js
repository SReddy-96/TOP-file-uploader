const passport = require("passport");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validateUser = [
  body("username").trim().notEmpty().withMessage(`Username ${notEmptyErr}`),
  body("password").trim().notEmpty().withMessage(`Password ${notEmptyErr}`),
];

// get login form
const getLogin = async (req, res) => {
  // if already logged in
  if (req.user) {
    return res.redirect("/home");
  }
  res.render("login", {
    title: "Login",
  });
};

// post request
const postLogin = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        title: "Login",
        errors: errors.array(),
      });
    }
    next();
  },
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render("login", {
          errors: [{ msg: info?.message || "Login failed" }],
          title: "Login",
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("/home");
      });
    })(req, res, next);
  },
];

module.exports = {
  getLogin,
  postLogin,
};
