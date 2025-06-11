const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, "./uploads/");
  },
  filename: (req, file, done) => {
    done(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const notEmptyErr = "must not be empty";

const validateFile = [
  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("File is required.");
    }
    return true;
  }),
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
    try {
      const newFile = await db.addFile(req.file, folder, req.user.id);
    } catch (error) {
      console.error(error);
      next(error);
    }
    res.redirect("/home");
  },
];

module.exports = {
  getFile,
  postFile,
};
