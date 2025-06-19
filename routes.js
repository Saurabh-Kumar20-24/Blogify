const express = require('express')
const router = express.Router();
const { register, signup, loginPage, login, allUsers } = require("./controllers/userController.js");
const {requireAuth} = require('./utils/auth.js');
const { home, myblogs, addblog, createblog, deleteblog, editblog, updateblog } = require('./controllers/blogController.js');


router.get("/signup", signup);
router.get("/login", loginPage);
router.post("/register", register);
router.post("/login", login);
router.get('/allusers',requireAuth, allUsers)
router.get("/logout", loginPage);
router.get('/',home)


router.get('/home',home)
router.get('/myblogs',requireAuth,myblogs)
router.get('/addblog',requireAuth,addblog)
router.get('/editblog',requireAuth,editblog)
router.post('/createblog',requireAuth,createblog)
router.post('/updateblog',requireAuth,updateblog)
router.get('/deleteblog',deleteblog)



module.exports = router
