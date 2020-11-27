const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
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
app.use(morgan("dev"));

// mongoose and mongo sandbox routes
app.get("/add-blog", (req, res) => {
    const blog  = new Blog({
        title: "New Blog",
        snippet: "About my new blog",
        body: "More about my new blog"
    });

    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
})

//routes
app.get("/", (req, res) => {
    const blogs = [
        {title: "Yoshi finds eggs", snippet: "Lorem ipsum dolar sit amet consectetur"},
        {title: "Mario finds stars", snippet: "Lorem ipsum dolar sit amet consectetur"},
        {title: "How to defeat bowser", snippet: "Lorem ipsum dolar sit amet consectetur"},
    ];
    res.render("index", {title: "Home", blogs});
});

app.get("/about", (req, res) => {
    res.render("about", {title: "About"});
});

app.get("/blogs/create", (req, res) => {
    res.render("create", {title: "Create new Blog"});
});

// redirects
app.get("/about-us", (req, res) => {
    res.redirect("/about");
});

// 404 Page
app.use((req, res) => {
    res.status(404).render("404", {title: "404"});
});