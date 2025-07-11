// models/Teacher.js
import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjects: [{ type: String }],
  classes: [{ type: String }]
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;