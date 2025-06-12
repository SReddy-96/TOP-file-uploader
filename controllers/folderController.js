const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const getDescendantIds = require("../middleware/getDescendantIds");

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

const getUpdateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No file Id");
      err.statusCode = 401;
      return next(err);
    }
    const folder = await db.getFolderById(parseInt(id));
    const allFolders = res.locals.folders;

    // just getting the available parent folders and not children
    const descendantIds = getDescendantIds(folder, allFolders);

    const parentOptions = allFolders.filter(
      (f) => f.id !== folder.id && !descendantIds.includes(f.id),
    );

    res.render("updateFolder", {
      title: `Update: ${folder.name}`,
      folder: folder,
      parentOptions: parentOptions,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postUpdateFolder = [
  validateFolder,
  async (req, res, next) => {
    // check for folder if none then null
    const { id } = req.params;
    let { parentFolder, name } = req.body;
    if (!parentFolder) {
      parentFolder = null;
    } else {
      parentFolder = parseInt(parentFolder); // convert to Int
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateFolder", {
        title: "Update Folder",
        errors: errors.array(),
      });
    }
    try {
      const UpdatedFolder = await db.updateFolder(
        parseInt(id),
        name,
        parentFolder,
        req.user.id,
      );
      return res.redirect("/home");
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      next(error);
    }
  },
];

const getDeleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No Folder Id");
      err.statusCode = 401;
      return next(err);
    }
    const folder = await db.getFolderById(parseInt(id));
    res.render("delete", {
      title: `Delete ${folder.name}`,
      fileOrFolder: "folder",
      name: folder.name,
      id: folder.id,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postDeleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No Folder Id");
      err.statusCode = 401;
      return next(err);
    }
    const deletedFolder = await db.deleteFolder(parseInt(id), req.user.id);
    res.redirect("/home");
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getFolder,
  postFolder,
  readFolder,
  getUpdateFolder,
  postUpdateFolder,
  getDeleteFolder,
  postDeleteFolder,
};
