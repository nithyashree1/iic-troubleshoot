const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const User = require("./models/user");
const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

mongoose.connect("mongodb://localhost:27017/login-app-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(__dirname + "./public/"));
app.use(express.json());
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

app.get("/event/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const solution = await Comment.findById(id);
  res.render("comments/show", { solution });
});
app.get("/event/:id/edit", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const solution = await Comment.findById(id);
  res.render("comments/edit", { solution });
});
app.put("/event/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  let newSolution = {
    uname: req.body.uname,
    email: req.body.email,
    branch: req.body.branch,
    semester: req.body.semester,
    USN: req.body.usn,
    wrongSol: req.body.wrongSol,
    solution: req.body.solution,
  };
  const solution = await Comment.findByIdAndUpdate(id, newSolution, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/event/${solution._id}`);
});

app.get("/login", async (req, res) => {
  res.render("comments/login");
});

app.get("/register", async (req, res) => {
  res.render("comments/register");
});

app.post("/", async (req, res) => {
  let newSolution = new Comment({
    uname: req.body.uname,
    email: req.body.email,
    branch: req.body.branch,
    semester: req.body.semester,
    USN: req.body.usn,
    wrongSol: req.body.wrongSol,
    solution: req.body.solution,
  });
  await newSolution.save();
  res.redirect(`/event/${newSolution._id}`);
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server up at 3000");
});
