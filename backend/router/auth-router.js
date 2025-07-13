import express from "express";
import { Router } from "express";
import {home, login, adduser} from "../controllers/auth-controller.js"
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Post from "../models/Post.js";
import Student from "../models/Student.js";

const router = express.Router();

// Admin: Get all users
router.get("/users", auth(["admin"]), async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Teacher: Mark attendance
router.post("/attendance", auth(["teacher"]), async (req, res) => {
  try {
    const { className, date, records } = req.body;

    const attendance = new Attendance({
      className,
      date,
      records,
      markedBy: req.user.id
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Teacher: Post assignment/result/notice
router.post("/post", auth(["teacher"]), async (req, res) => {
  try {
    const { title, content, className, type } = req.body;

    const post = new Post({
      title,
      content,
      className,
      type,
      postedBy: req.user.id
    });

    await post.save();
    res.status(201).json({ message: "Post created" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Student: View own attendance
router.get("/attendance", auth(["student"]), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    const records = await Attendance.find({
      className: student.className
    });

    const result = records.map(r => ({
      date: r.date,
      status: r.records.find(x => x.student.toString() === student._id.toString())?.status || "absent"
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// Student: View posts (assignment/result/notice)
router.get("/posts", auth(["student"]), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    const posts = await Post.find({ className: student.className }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

router.get("/", home);
router.post("/login", login)
router.post("/add-usr", adduser);

export default router;