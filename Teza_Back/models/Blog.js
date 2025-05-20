const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  content: String,
  image: { type: String, default: null },
  author: String,
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedUsers: [{ type: String }], // Listă cu userId-urile celor care au dat like
  comments: [{ text: String, author: String }],
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
