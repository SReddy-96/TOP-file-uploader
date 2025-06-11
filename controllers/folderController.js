const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const notEmptyErr = "must not be empty";

const validateFolder = [
  body("name").trim().notEmpty().withMessage(`Name ${notEmptyErr}`),
];

const getFolder = (req, res) => {
  res.render("newFolder", { title: "Add Folder" });
};

const postFolder = [
  validateFolder,
  async (req, res, next) => {
    // check for folder if none then null
    let { folder, name } = req.body;
    if (!folder) {
      folder = null;
    } else {
      folder = parseInt(folder); // convert to Int
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newFolder", {
        title: "Add Folder",
        errors: errors.array(),
      });
    }
    try {
      const newFolder = await db.addFolder(name, folder, req.user.id);
    } catch (error) {
      console.error(error);
      next(error);
    }
    res.redirect("/home");
  },
];

module.exports = {
  getFolder,
  postFolder,
};
