const { Router } = require("express");
const fetchFolders = require("../middleware/fetchFolders");
const { getFolder, postFolder } = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/add", [fetchFolders, getFolder]);
folderRouter.post("/add", postFolder);

module.exports = folderRouter;
