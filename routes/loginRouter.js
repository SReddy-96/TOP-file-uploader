const { Router } = require("express");
const { getLogin, postLogin } = require("../controllers/loginController");

const loginRouter = Router();

loginRouter.get("/", getLogin);
loginRouter.post("/", postLogin);

module.exports = loginRouter;
