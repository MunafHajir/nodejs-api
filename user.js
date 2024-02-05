const express = require("express");
const router = express.Router();
const connection = require('./database');

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
// router.get("/", getUsers);
router.get("/:id", getUserDetails);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;