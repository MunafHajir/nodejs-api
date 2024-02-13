const express = require("express");
const bodyParser = require("body-parser");

const uuid = require("uuid").v4;
const v1 = require('./apis/v1');

const app = express();
app.use(bodyParser.json());

//application level middleware
app.use((req, res, next) => {
  req.headers["request_id"] = uuid();
  next()
});


// private apis
app.use('/v1', v1);

app.listen(3000, console.log("server started"));
