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
    error.statusCode = error.statusCode || 500; 
    next(error);
    }
    res.redirect("/home");
  },
];

const readFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No Folder Id");
      err.statusCode = 401;
      return next(err);
    }
    const folder = await db.getFolderById(parseInt(id));
    res.render("folder", { title: folder.name, folder: folder });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getFolder,
  postFolder,
  readFolder
};
