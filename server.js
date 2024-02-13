const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid").v4;

const v1 = require("./apis/v1");

const app = express();
app.use(bodyParser.json());

const options = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(options));
//application level middleware
app.use((req, res, next) => {
  req.headers["request_id"] = uuid();
  next();
});

// private apis
app.use("/v1", v1);

app.listen(3000, console.log("server started"));
