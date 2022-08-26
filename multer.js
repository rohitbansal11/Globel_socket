const DIR = "./uploads/ck";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
    console.log(DIR, "in the dir");
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    req.body.fileName = date + "-" + fileName;
    cb(null, date + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});













router.post(
  "/ckImageUpload",
  authentication,
  upload.single("ckImage"),
  emailController.getCkImage
);


const getCkImage = async (req, res) => {
  try {
    return res.status(200).send({
      status: 200,
      url: `${process.env.API_BASE_URL}/uploads/ck/${req.body.fileName}`,
      message: "image uploaded  successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again later!",
      error: err.message,
    });
  }
};






