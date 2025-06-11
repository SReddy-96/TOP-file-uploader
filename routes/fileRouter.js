const { Router } = require("express");
const { getFile, postFile, readFile } = require("../controllers/fileController");
const fetchFolders = require("../middleware/fetchFolders");

const fileRouter = Router();

fileRouter.get("/add", [fetchFolders, getFile]);
fileRouter.post("/add", postFile);

fileRouter.get("/:id", readFile);

module.exports = fileRouter;
