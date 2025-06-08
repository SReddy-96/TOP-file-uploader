const { Router } = require("express");
const { getIndex } = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getIndex);

module.exports = indexRouter;
