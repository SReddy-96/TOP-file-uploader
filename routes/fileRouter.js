const { Router } = require("express");
const { getFile, postFile } = require("../controllers/fileController");
const fetchFolders = require("../middleware/fetchFolders");

const fileRouter = Router();

fileRouter.get("/add", [fetchFolders, getFile]);
fileRouter.post("/add", postFile);

module.exports = fileRouter;
