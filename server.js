const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser')

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "netflix",
});

const app = express();
app.use(bodyParser.json())


const getUsers = async (req, res, next) => {
  try {
      const [results] = await connection.promise().query("SELECT * FROM users");
      res.send();
  } catch(err) {
      console.log(err)
  }
}

const createUser = async (req, res, next) => {
  const { id, email, phone_no, passward, is_active, created_at } = req.body;

  const queryString = `
  insert into users 
  (id, email, phone_no, passward, is_active, created_at)
  values (${id}, "${email}", ${phone_no}, "${passward}", ${is_active}, "${created_at}");
  `

  const [results] = await connection.promise().query(queryString);
  
  res.status(201).send({
    message: "Users added successfully",
    results
  })
}



// Users Api
app.get("/users", getUsers);
app.post("/users", createUser);


app.listen(3000, console.log("server started"));
