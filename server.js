const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "netflix",
});

const app = express();
app.use(bodyParser.json());

const getUsers = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;

    const queryData = req.query;
    let phoneNo = queryData.phone_no;
    if (!phoneNo) {
      res.status(400).send({ message: "phone_no is required" });
    }

    const queryString =
      "SELECT email, phone_no, is_active, created_at FROM users WHERE phone_no = ? LIMIT ? OFFSET ?";
    const [results] = await connection
      .promise()
      .execute(queryString, [phoneNo, limit, offset]);
    const countQueryString = "SELECT COUNT(*) as count FROM users";
    const [countResults] = await connection.promise().execute(countQueryString);

    const responseBody = {
      message: "Users list",
      list: results,
      count: countResults[0].count,
    };

    res.status(200).send(responseBody);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res, next) => {
  const { id, email, phone_no, passward, is_active, created_at } = req.body;

  const queryString = `
  insert into users 
  (email, phone_no, passward, is_active)
  values ( ?, ?, ?, ?);
  `;

  const [results] = await connection
    .promise()
    .execute(queryString, [email, phone_no, passward, is_active]);

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
    const [results] = await connection
      .promise()
      .execute(queryString, [id]);
    console.log(results);
    if(!results || results.length === 0){
      res.status(404).send({message: "User not found"});
    }

    const responseBody = {
      message: "Users list",
      details: results[0]
    };

    res.status(200).send(responseBody);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Users Api
app.get("/users", getUsers);
app.get("/users/:id", getUserDetails);
app.post("/users", createUser);

app.listen(3000, console.log("server started"));
