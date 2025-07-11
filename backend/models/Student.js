// models/Student.js
import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rollNumber: { type: String, required: true },
  className: { type: String, required: true },
  feesPaid: { type: Boolean, default: false }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;