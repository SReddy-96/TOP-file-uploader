const { Router } = require("express");
const { getFile, postFile } = require("../controllers/fileController");

const fileRouter = Router();

fileRouter.get("/add",getFile);
fileRouter.post("/add", postFile);

module.exports = fileRouter;
