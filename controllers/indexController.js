const db = require("../db/queries");

const getIndex = async (req, res, next) => {
  try {
    if (!req.user) {
      const err = new Error("User not authenticated");
      err.statusCode = 401;
      return next(err);
    }
    const allFiles = await db.getAllFilesByUser(req.user.id);
    res.render("index", { title: "Home", files: allFiles });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getIndex,
};
