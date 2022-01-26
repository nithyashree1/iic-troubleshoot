const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  uname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    require: true,
  },
  branch: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    require: true,
  },
  solution: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
