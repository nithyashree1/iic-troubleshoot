const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

mongoose.connect(
  "mongodb+srv://SuhasBG:Suhasbg%402001@solutions.nhams.mongodb.net/solutions?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// mongoose.connect('mongodb+srv://nithya-user:nithya-user@cluster0.r2cay.mongodb.net/iic-event?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true});

app.use(express.static(__dirname + "./public/"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  res.render("comments/home");
});
app.get("/event", async (req, res) => {
  res.render("comments/event");
});

app.listen(3000, () => {
  console.log("Server up at 3000");
});

app.post("/", function (req, res) {
  let newUser = new Comment({
    uname: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    college: req.body.college,
    branch: req.body.branch,
    question: req.body.question,
    solution: req.body.solution,
  });
  newUser.save();
  res.redirect("/");
});
