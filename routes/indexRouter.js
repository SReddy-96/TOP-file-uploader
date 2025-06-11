const { Router } = require("express");
const { getIndex } = require("../controllers/indexController");
const fetchFolders = require("../middleware/fetchFolders");

const indexRouter = Router();

indexRouter.get("/", [fetchFolders, getIndex]);

module.exports = indexRouter;
