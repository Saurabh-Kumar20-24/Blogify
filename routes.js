const express = require('express')
const router = express.Router();
const { register, signup, loginPage, login, allUsers } = require("./controllers/userController.js");
const {requireAuth} = require('./utils/auth.js');
const { home, myBlogs, addBlog, createBlog, deleteBlog, editBlog, updateBlog } = require('./controllers/blogController.js');


router.get("/signup", signup);
router.get("/login", loginPage);
router.post("/register", register);
router.post("/login", login);
router.get('/allusers',requireAuth, allUsers)
router.get("/logout", loginPage);
router.get('/',home)


router.get('/home',home)
router.get('/myblogs',requireAuth,myBlogs)
router.get('/addblog',requireAuth,addBlog)
router.get('/editblog',requireAuth,editBlog)
router.post('/createblog',requireAuth,createBlog)
router.post('/updateblog',requireAuth,updateBlog)
router.get('/deleteblog',deleteBlog)



module.exports = router