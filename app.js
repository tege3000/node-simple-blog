const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const { render } = require("ejs");
// express app
const app = express();
// connect to mongodb
const dbURI = "mongodb+srv://enisen:abc1234@node-tuts.pgsiu.mongodb.net/node-tuts?retryWrites=true&w=majority";


mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log("connected to db");

        // only listen for requests after database connecting is set up
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

// register view engin 
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // for accepting form data
app.use(morgan("dev"));


//routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.get("/about", (req, res) => {
    res.render("about", {title: "About"});
});

// blog routes
app.get("/blogs", (req, res) => {
    Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render("index", {title: "All blogs", blogs: result});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/blogs", (req, res) => {
    const blog = new Blog(req.body);
    blog.save() 
        .then((result) => {
            res.redirect("/blogs");
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render("details", {blog: result, title: "Blog Details"});
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/blogs/create", (req, res) => {
    res.render("create", {title: "Create new Blog"});
});


// 404 Page
app.use((req, res) => {
    res.status(404).render("404", {title: "404"});
});