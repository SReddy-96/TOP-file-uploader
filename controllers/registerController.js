const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const alphaErr = "must only contain letters.";
const notEmptyErr = "must not be empty";
const lengthErr = "must be between 2 and 30 characters.";

const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${notEmptyErr}`)
    .isEmail()
    .withMessage("Needs to be a valid Email")
    .custom(async (value) => {
      const user = await db.getUserByEmail(value);
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`username ${notEmptyErr}`)
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters.")
    .matches(/^[a-zA-Z0-9_.-]+$/) // Recommended: Allow letters, numbers, underscore, dot, hyphen
    .withMessage(
      "Username can only contain letters, numbers, underscores, dots, and hyphens.",
    )
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`password ${notEmptyErr}`)
    .isLength({ min: 8 })
    .withMessage("Password must be over 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password ${notEmptyErr}`)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // Changed to check for inequality
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

// get request
const getRegister = async (req, res) => {
  res.render("register", { title: "Register" });
};

// post request
const postRegister = [
  validateUser,
  async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("register", {
          title: "Register",
          errors: errors.array(),
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.insertUser(email, username, hashedPassword);
      // Automatically log in the user
      req.login(newUser, (err) => {
        if (err) return next(err);
        res.redirect("/home");
      });
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      next(error);
    }
  },
];

module.exports = {
  getRegister,
  postRegister,
};
