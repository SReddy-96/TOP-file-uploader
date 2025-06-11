const db = require("../db/queries");


// fetch the folders only for the user and save to the locals to use in EJS
const fetchFolders = async (req, res, next) => {
  try {
    const folders = await db.getAllFoldersByUser(req.user.id);
    res.locals.folders = folders;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = fetchFolders;
