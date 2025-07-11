// models/Post.js
import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["assignment", "result", "notice"], required: true },
  content: { type: String, required: true },
  className: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;