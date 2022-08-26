const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const helmet = require("helmet");
const cors = require("cors");
const xmlparser = require("express-xml-bodyparser");
const socketIo = require("socket.io");
var morgan = require('morgan')
app.use(cors());
app.use(helmet());
app.use(morgan("dev"))
require("dotenv").config();
const CONFIG = require("./config.json");
require("./config/database");
const WebSockets = require("./utilities/WebSockets");

const bodyParser = require("body-parser");
const port = CONFIG.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(xmlparser());
app.use("/uploads", express.static("uploads"));
app.use("/contact", require("./routes/contactRoutes"));
app.use("/settings", require("./routes/settingsRouter"));
app.use("/user", require("./routes/userRoutes"));
app.use("/tag", require("./routes/tagRouter"));
app.use("/message", require("./routes/messageRouter"));
app.use("/compaign", require("./routes/compaignRouter"));
app.use("/email", require("./routes/emailRouter"));
app.use("/voice", require("./routes/voiceRouter"));
app.use("/template", require("./routes/templateRoutes"));
app.use("/email/template", require("./routes/emailTemplateRouter"));
app.use("/payment", require("./routes/paymentroutes"));

// error response

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
});
app.get('/',(req,res)=>{
  res.json({
    massage:'Api is ruuuning '
    
  })
})


// catch 404 and forward to error handler//
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});


const server = http.createServer(app);
/** Create socket connection */
global.io = new socketIo.Server(server, {
  cors: {
    origin: "*",
  },
  upgrade: false,
  // transports: ['websocket'],
  perMessageDeflate: false,
});
global.io.on("connection", WebSockets.connection);
server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
