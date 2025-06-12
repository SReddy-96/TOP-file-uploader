const { Router } = require("express");
const {
  getFile,
  postFile,
  readFile,
  getUpdateFile,
  postUpdateFile,
  getDeleteFile,
  postDeleteFile,
} = require("../controllers/fileController");
const fetchFolders = require("../middleware/fetchFolders");

const fileRouter = Router();

fileRouter.get("/add", [fetchFolders, getFile]);
fileRouter.post("/add", postFile);

fileRouter.get("/:id", readFile);

fileRouter.get("/update/:id", [fetchFolders, getUpdateFile]);
fileRouter.post("/update/:id", postUpdateFile);

fileRouter.get("/delete/:id", getDeleteFile);
fileRouter.post("/delete/:id", postDeleteFile);

module.exports = fileRouter;
