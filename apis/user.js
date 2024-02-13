const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const connection = require('../database');
const logger = require("../logger");
const saltRounds = 10;

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

  const hashedPassword = await bcrypt.hash(passward, saltRounds);

  const [results] = await connection
    .promise()
    .execute(queryString, [email, phone_no, hashedPassword]);

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

const getUserBalance = async (req, res, next) => {
  try {
    const { user_id } = req.headers;
    
    const responseBody = {
      message: "Current Balance",
      balance: 49900,
      user_id
    }

    res.status(200).send(responseBody);
  } catch (err) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, passward } = req.body;
    
    if (!email || !passward) {
      res.status(400).send({
        message: "email or password is required"
      });
    }

    // logger.log(req.headers, req.body, req.url, req.message, req.headers.request_id);
    

    
    const queryString =
    "SELECT id, email, passward FROM users WHERE email = ? and is_active = ?";
    const [results] = await connection.promise().execute(queryString, [email, 1]);
    
    if (!results || results.length === 0) {
      res.status(404).send({ message: "User not found" });
    }

    const dbPassword = results[0].passward;

    const isCorrectPassword = await bcrypt.compare(passward, dbPassword);
    
    if (!isCorrectPassword) {
      res.status(400).send({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ user_id: results[0].id }, 'tetseytyustu');

    const responseBody = {
      message: "Loggedin Successful",
      token
    }

    res.status(200).send(responseBody);
  } catch (err) {
    // logger.log(req.headers, req.body, req.url, err, req.headers.request_id);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const authMiddleware = (req, res, next) => {
  if (req.headers && req.headers.token) {
    try {
      const token = req.headers.token;
      const decodedToken = jwt.verify(token, 'tetseytyustu')
      console.log(decodedToken);
    } catch (err) {
      console.log({err})
      res.status(400).send({
        message: "Invalid Token"
      })
    }
    next()
    return;
  }

  res.status(400).send({
    message: "Token Required"
  })
}

router.get("/:id", authMiddleware, getUserDetails);
router.put("/:id", authMiddleware, updateUser);
router.get("/balance", authMiddleware, getUserBalance);

router.post("/login", login);
router.post("/", createUser);

module.exports = router;