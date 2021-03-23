require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const router = require("./router");
const socketio = require("./utility/socket-io");

const app = express();
const server = http.createServer(app);
socketio.SocketIo(server);

const whiteList =
  process.env.NODE_ENV === "production"
    ? process.env.ACCESS_CONTROL_ALLOW_ORIGIN_URL_PROD.split(",")
    : process.env.ACCESS_CONTROL_ALLOW_ORIGIN_URL_DEV.split(",");

app.use(
  cors({
    origin: (origin, cb) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'))
      }
    },
    optionsSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
