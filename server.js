const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const uuid = require("uuid").v4;
const user = require('./user');
const myntra = require('./myntra');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.headers["request_id"] = uuid();

  // if (!req.headers.hasOwnProperty("user_id")) {
    
  //   const log = `\n ${JSON.stringify({
  //     headers: req.headers,
  //     url: req.url,
  //     body: req.body,
  //     method: req.method,
  //     message: "User Id Not Found in headers",
  //     request_id: req.headers.request_id
  //   })}`;
  //   fs.appendFile(
  //     "log.txt",
  //     log,
  //     console.log
  //   );

  //   res.status(400).send({ msg: "User Id required" });
  // } else {
  //   next();
  // }


  next()
});

app.use('/users', user);
app.use('/myntra', myntra);

app.listen(3000, console.log("server started"));
