const multer = require("multer");
module.exports = () => {
  const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, "./uploads");
    },
    filename(req, file, callback) {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");
      req.body.fileName = fileName;
      callback(null, Date.now() + "-" + fileName);
    },
  });
  return multer({ storage });
};
