const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const fs = require("fs");
const uuid = require("uuid").v4;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "netflix",
});

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.headers["request_id"] = uuid();

  if (!req.headers.hasOwnProperty("user_id")) {
    
    const log = `\n ${JSON.stringify({
      headers: req.headers,
      url: req.url,
      body: req.body,
      method: req.method,
      message: "User Id Not Found in headers",
      request_id: req.headers.request_id
    })}`;
    fs.appendFile(
      "log.txt",
      log,
      console.log
    );

    res.status(400).send({ msg: "User Id required" });
  } else {
    next();
  }
});

const getUsers = async (req, res, next) => {
  try {
    const { offset } = req.query;
    const queryData = req.query;

    let limit = 2;
    
    let log = `\n ${JSON.stringify({
      headers: req.headers,
      url: req.url,
      body: req.body,
      method: req.method,
      message: "getUsers function called",
      request_id: req.headers.request_id
    })}`;
    fs.appendFile(
      "log.txt",
      log,
      console.log
    );

    const queryString =
      "SELECT email, is_active, created_at FROM users ORDER BY id DESC LIMIT ? OFFSET ? ";
    const [results] = await connection
      .promise()
      .execute(queryString, [limit, offset]);
      
    const countQueryString = "SELECT COUNT(*) as count FROM users";
    const [countResults] = await connection.promise().execute(countQueryString);

    log = `\n ${JSON.stringify({
      headers: req.headers,
      url: req.url,
      body: req.body,
      method: req.method,
      message: "getUsers function -> db query called",
      request_id: req.headers.request_id,
      results
    })}`;
    fs.appendFile(
      "log.txt",
      log,
      console.log
    );

    const responseBody = {
      message: "Users list",
      list: results,
      count: countResults[0].count,
    };

    log = `\n ${JSON.stringify({
      headers: req.headers,
      url: req.url,
      body: req.body,
      method: req.method,
      message: "getUsers function -> db query called -> response body",
      request_id: req.headers.request_id,
      responseBody
    })}`;
    fs.appendFile(
      "log.txt",
      log,
      console.log
    );
    res.status(200).send(responseBody);
  } catch (err) {
    log = `\n ${JSON.stringify({
      headers: req.headers,
      url: req.url,
      body: req.body,
      method: req.method,
      message: "getUsers function -> db query called -> response body",
      request_id: req.headers.request_id,
      err
    })}`;
    fs.appendFile(
      "log.txt",
      log,
      console.log
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res, next) => {
  const { email, phone_no, passward } = req.body;

  if (!email || !phone_no || !passward) {
    res.status(400).send({
      message: "Invalid request",
    });
  }

  const queryString = `
  insert into users 
  (email, phone_no, passward)
  values ( ?, ?, ?);
  `;

  const [results] = await connection
    .promise()
    .execute(queryString, [email, phone_no, passward]);

  res.status(201).send({
    message: "Users added successfully",
    results,
  });
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, phone_no } = req.body;

  if (!id) {
    res.status(400).send({
      message: "Invalid request",
    });
  }

  if (!email && !phone_no) {
    ``;
    res.status(400).send({
      message: "Invalid request",
    });
  }

  let setData = [];
  let queryData = [];

  if (email) {
    setData.push("email=?");
    queryData.push(email);
  }

  if (phone_no) {
    setData.push("phone_no=?");
    queryData.push(phone_no);
  }

  const setString = setData.join(",");

  const queryString = `UPDATE users SET ${setString} WHERE id = ? `;

  const [results] = await connection
    .promise()
    .execute(queryString, [...queryData, id]);

  res.status(201).send({
    message: "Users added successfully",
    results,
  });
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    //validation
    const queryString =
      "SELECT email, phone_no, is_active, created_at FROM users WHERE id = ?";
    const [results] = await connection.promise().execute(queryString, [id]);
    console.log(results);
    if (!results || results.length === 0) {
      res.status(404).send({ message: "User not found" });
    }

    const responseBody = {
      message: "Users list",
      details: results[0],
    };

    res.status(200).send(responseBody);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Users Api
app.get("/v1/users", getUsers);
app.get("/v1/users/:id", getUserDetails);
app.post("/v1/users", createUser);
app.put("/v1/users/:id", updateUser);

app.listen(3000, console.log("server started"));
