const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const supabase = require("../db/supabaseClient");
const upload = multer({ storage: multer.memoryStorage() });

const notEmptyErr = "must not be empty";

const validateFile = [
  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("File is required.");
    }
    return true;
  }),
];

const validateUpdateFile = [
  body("name").trim().notEmpty().withMessage(`Name ${notEmptyErr}`),
];

const getFile = (req, res) => {
  res.render("newFile", { title: "Add File" });
};

const postFile = [
  upload.single("file"),
  validateFile,
  async (req, res, next) => {
    // check for folder if none then null
    let { folder } = req.body || null;
    if (folder) {
      folder = parseInt(folder); // convert to Int
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newFile", {
        title: "Add File",
        errors: errors.array(),
      });
    }
    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;

    try {
      // uploading to supabase
      const { data, error } = await supabase.storage
        .from("files")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        const err = new Error("Error uploading file to storage");
        err.statusCode = 401;
        return next(err);
      }

      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(fileName);

      const fileUrl = publicUrlData.publicUrl;

      const newFile = await db.addFile(
        req.file,
        fileUrl,
        folder,
        req.user.id,
        fileName,
      );
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      next(error);
    }
    res.redirect("/home");
  },
];

const readFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No file Id");
      err.statusCode = 401;
      return next(err);
    }
    const file = await db.getFileById(parseInt(id), req.user.id);
    if (!file) {
      const err = new Error("File not found");
      err.statusCode = 404;
      return next(err);
    }
    res.render("file", { title: file.name, file: file });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const getUpdateFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No file Id");
      err.statusCode = 401;
      return next(err);
    }
    const file = await db.getFileById(parseInt(id), req.user.id);
    if (!file) {
      const err = new Error("File not found");
      err.statusCode = 404;
      return next(err);
    }
    res.render("updateFile", { title: `Update: ${file.name}`, file: file });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postUpdateFile = [
  upload.single("file"),
  validateUpdateFile,
  async (req, res, next) => {
    // check for folder if none then null
    const { id } = req.params;
    let { folder, name } = req.body;
    if (folder) {
      folder = parseInt(folder); // convert to Int
    } else {
      folder = null;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateFile", {
        title: "Update File",
        errors: errors.array(),
      });
    }
    try {
      const updatedFile = await db.updateFile(
        parseInt(id),
        name,
        folder,
        req.user.id,
      );
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      next(error);
    }
    res.redirect("/home");
  },
];

const getDeleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No file Id");
      err.statusCode = 401;
      return next(err);
    }
    const file = await db.getFileById(parseInt(id), req.user.id);
    if (!file) {
      const err = new Error("File not found");
      err.statusCode = 404;
      return next(err);
    }
    res.render("delete", {
      title: `Delete ${file.name}`,
      fileOrFolder: "file",
      name: file.name,
      id: file.id,
      path: file.path,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const postDeleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error("No file Id");
      err.statusCode = 401;
      return next(err);
    }

    // path of file in supabase
    const { path } = req.body;
    if (!path) {
      const err = new Error("No file Path");
      err.statusCode = 401;
      return next(err);
    }

    const { data, error } = await supabase.storage
      .from("files")
      .remove([path]);

    if (error) {
      const err = new Error("Error deleting file from storage");
      err.statusCode = 401;
      return next(err);
    }

    const deletedFile = await db.deleteFile(parseInt(id), req.user.id);
    res.redirect("/home");
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getFile,
  postFile,
  readFile,
  getUpdateFile,
  postUpdateFile,
  getDeleteFile,
  postDeleteFile,
};
