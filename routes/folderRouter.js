const { Router } = require("express");
const fetchFolders = require("../middleware/fetchFolders");
const {
  getFolder,
  postFolder,
  readFolder,
  getUpdateFolder,
  postUpdateFolder,
  getDeleteFolder,
  postDeleteFolder,
} = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/add", [fetchFolders, getFolder]);
folderRouter.post("/add", postFolder);

folderRouter.get("/:id", readFolder);

folderRouter.get("/update/:id", [fetchFolders, getUpdateFolder]);
folderRouter.post("/update/:id", postUpdateFolder);

folderRouter.get("/delete/:id", getDeleteFolder);
folderRouter.post("/delete/:id", postDeleteFolder);

module.exports = folderRouter;
