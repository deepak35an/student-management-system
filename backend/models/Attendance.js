// models/Attendance.js
import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  className: { type: String, required: true },
  date: { type: Date, required: true },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    status: { type: String, enum: ["present", "absent"], required: true }
  }],
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;