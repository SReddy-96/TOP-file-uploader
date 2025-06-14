const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const supabase = require("../db/supabaseClient");

const notEmptyErr = "must not be empty";

const validateUpdateProfile = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${notEmptyErr}`)
    .isEmail()
    .withMessage("Needs to be a valid Email")
    .custom(async (value, { req }) => {
      const currentUser = req.user;
      const user = await db.getUserByEmail(value);
      if (user.id === currentUser.id) {
        return true; // Allow the current user's email to remain unchanged
      }
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
    .custom(async (value, { req }) => {
      const currentUser = req.user;
      const user = await db.getUserByUsername(value);
      if (user.id === currentUser.id) {
        return true; // Allow the current user's email to remain unchanged
      }
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
];

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No User Id");
      err.statusCode = 401;
      return next(err);
    }
    const profile = await db.getUserById(parseInt(id));
    res.render("profile", { title: "User Profile", user: profile });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const getUpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No User Id");
      err.statusCode = 401;
      return next(err);
    }
    const profile = await db.getUserById(parseInt(id));
    res.render("updateUser", { title: "Update User Profile", user: profile });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postUpdateProfile = [
  validateUpdateProfile,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        const err = new Error("No User Id");
        err.statusCode = 401;
        return next(err);
      }
      const { username, email } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update User",
          errors: errors.array(),
        });
      }
      await db.updateUser(parseInt(id), username, email);
      const updatedUser = await db.getUserById(parseInt(id));
      res.render("profile", { title: "User Profile", user: updatedUser });
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      next(error);
    }
  },
];

const getDeleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No User Id");
      err.statusCode = 401;
      return next(err);
    }
    const user = await db.getUserById(parseInt(id));
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    res.render("delete", {
      title: `Delete ${user.username}`,
      type: "profile",
      name: user.username,
      id: user.id,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postDeleteProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No User Id");
      err.statusCode = 401;
      return next(err);
    }
    // when deleting get all the files of the user and delete them from storage
    const filePaths = await db.deleteUser(parseInt(id));
    filePaths.forEach(async (filePath) => {
      const { errors } = await supabase.storage
        .from("files")
        .remove([filePath]);
      if (errors) {
        const err = new Error("Error deleting file from storage");
        err.statusCode = 401;
        return next(err);
      }
    });
    res.redirect("/");
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getProfile,
  getUpdateProfile,
  postUpdateProfile,
  getDeleteProfile,
  postDeleteProfile,
};
