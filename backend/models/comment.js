const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Blog",
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema, "comments");
