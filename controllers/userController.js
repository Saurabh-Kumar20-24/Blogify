const bcrypt = require("bcrypt");
const base64 = require("base-64");
const Users = require("../models/userModel.js");

const signup = (req, res)=>{
    res.render('signup',{message: null})
}

const loginPage = (req, res) => {
  res.render("login", { message: null });
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        message: "user already present in db try login",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      password: hashPassword,
    });
    console.log(newUser);
    newUser
      .save()
      .then((response) => {
        res.render("login", { message: "user created successfully" });
      })
      .catch((err) => {
        res.render("signup", {
          message: "user not created,Please try again later",
        });
      });
  } catch (error) {
    res.render("signup", {
      message: "user cannot be create due to server issue",
    });
  }}

const login  = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.render("login", {
        message: "user not exist with this email",
      });
    }
    const passwordMatch = await bcrypt.compare(password,existingUser.password);
    if(passwordMatch){
       req.session.userId  = existingUser._id;
       return res.redirect('/')
    }else{
        return res.render("login", {
        message: "invalid password",
      });
    }
  } catch (error) {
    return res.render("login", {
        message: "server error, login again",
      });
  }
}

const allUsers = (req, res)=>{
    Users.find()
    .then(response=>{
      res.json(response)
    })
    .catch(error=>{
      res.json(error)
    })
}

const logout = (req, res) =>{
  req.session.destroy(()=>{
    return res.redirect('/home')
  })
}

module.exports = {
    signup,
    loginPage,
    register,
    login,
    allUsers,
    logout
}