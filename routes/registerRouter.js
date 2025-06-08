const { Router } = require("express");
const {
  getRegister,
  postRegister,
} = require("../controllers/registerController");

const registerRouter = Router();

registerRouter.get("/", getRegister);
registerRouter.post("/", postRegister);

module.exports = registerRouter;
