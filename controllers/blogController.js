const Blogs = require("../models/blogsModel");
const base64 = require("base-64");

const home = async (req, res) => {
  const perPage = 5;
  const page = req.query.page || 1;
  const sort = req.query.sort || "title";

  try {
    const blogs = await Blogs.find()
      .sort({ [sort]: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage);
    const count = await Blogs.countDocuments();
    const totalPages = Math.ceil(count / perPage);
    res.render("home", {
      message: null,
      blogData: blogs,
      current: page,
      pages: totalPages,
      sort,
    });
  } catch (error) {
    res.render("home", { message: null, blogData: null });
  }
};

const myBlogs = async (req, res) => {
  try {
    const { message } = req.query;
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).render("login", {
        message: "Session expired or unauthorized access",
      });
    }
    const myBlogs = await Blogs.find({ userId });
    res.render("myblogs", {
      message: message ? base64.decode(message) : null,
      blogData: myBlogs,
    });
  } catch (error) {
    console.log("Error loading my blogs:", error);
    res.status(500).render("myblogs", {
      message: "Internal server error",
      blogData: [],
    });
  }
};
const addBlog = (req, res) => {
  res.render("addblog", { message: null });
};
const editBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    const blogData = await Blogs.findOne({ _id: blogId });
    res.render("editblog", { message: null, blogData });
  } catch (error) {
    const err = base64.encode("Blog cannot be edited. Please try later.");
    res.redirect(`/myblogs?message=${err}`);
  }
};

const createBlog = (req, res) => {
  try {
    const { title, body } = req.body;
    const newBlog = new Blogs({ title, body, userId: req.session.userId });
    newBlog
      .save()
      .then((response) => {
        res.redirect("/myblogs");
      })
      .catch((err) => {
        res.render("addblog", "blog cannot be saved at the moment");
      });
  } catch (error) {
    res.render("addblog", { message: "Blog not created, server error" });
  }
};

const updateBlog = (req, res) => {
  try {
    const { blogId } = req.query;
    Blogs.findByIdAndUpdate({ _id: blogId }, req.body)
      .then((response) => {
        res.redirect("/myblogs");
      })
      .catch((error) => {
        res.render("editblog", {
          message: "Blog not updated, try again later.",
        });
      });
  } catch (error) {
    res.render("editblog", { message: "Blog not updated, server error" });
  }
};

const deleteBlog = (req, res) => {
  try {
    const { blogId } = req.query;
    Blogs.findOneAndDelete({ _id: blogId })
      .then((response) => {
        res.redirect("/myblogs");
      })
      .catch((error) => {
        const err = base64.encode("Blog cannot be deleted. Please try later.");
        res.redirect(`/myblogs?message=${err}`);
      });
  } catch (error) {
    const err = base64.encode("Blog cannot be deleted. Please try later.");
    res.redirect(`/myblogs?message=${err}`);
  }
};

module.exports = {
  home,
  myBlogs,
  addBlog,
  createBlog,
  deleteBlog,
  editBlog,
  updateBlog,
};
