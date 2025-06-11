const multer = require("multer");
const upload = multer({ dest: "./uploads/" });

const uploadMiddleware = upload.single("file");

const getFile = (req, res) => {
  res.render("newFile", { title: "Add File" });
};

const postFile = [
  uploadMiddleware,
  async (req, res) => {
    
    console.log(req.file.originalname)
  },
];

module.exports = {
  getFile,
  postFile,
};
