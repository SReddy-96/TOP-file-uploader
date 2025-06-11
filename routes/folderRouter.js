const { Router } = require("express");
const fetchFolders = require("../middleware/fetchFolders");
const {
  getFolder,
  postFolder,
  readFolder,
} = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/add", [fetchFolders, getFolder]);
folderRouter.post("/add", postFolder);

folderRouter.get("/:id", readFolder);

module.exports = folderRouter;
