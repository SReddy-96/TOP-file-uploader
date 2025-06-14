const { Router } = require("express");
const {
  getProfile,
  getUpdateProfile,
  postUpdateProfile,
  getDeleteProfile,
  postDeleteProfile,
} = require("../controllers/userController");

const profileRouter = Router();

profileRouter.get("/:id", getProfile);

profileRouter.get("/edit/:id", getUpdateProfile);
profileRouter.post("/edit/:id", postUpdateProfile);

profileRouter.get("/delete/:id", getDeleteProfile);
profileRouter.post("/delete/:id", postDeleteProfile);

module.exports = profileRouter;
