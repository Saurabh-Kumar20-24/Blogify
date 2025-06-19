const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const session = require('express-session');
const { checkAuth } = require("./utils/auth");

require('dotenv').config();

const app = express();

app.use(express.json());
//this middleware used to accept the data from the signup from
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rqjj26d.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.set("view engine", "ejs");

app.use(checkAuth)
app.use(router)

app.listen(3000, () => {
  console.log("running on 3000");
});
