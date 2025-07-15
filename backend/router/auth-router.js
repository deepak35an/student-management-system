import express from "express";
import { Router } from "express";
import { home, login, adduser } from "../controllers/auth-controller.js"
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Post from "../models/Post.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Admin: Get all users
// router.get("/users", auth(["admin"]), async (req, res) => {
//   try {
//     const users = await Student.find({}, "-password").populate('user');
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

router.get("/users", auth(["admin"]), async (req, res) => {
  try {
    // Get all students and populate their user info
    const students = await Student.find().populate("user", "-password");

    // Get all teachers and populate their user info
    const teachers = await Teacher.find().populate("user", "-password");

    // Combine and format the data with a `type` field
    const combined = [
      ...students.map((s) => ({
        _id: s._id,
        type: "student",
        user: s.user,
        rollNumber: s.rollNumber,
        className: s.className,
        feesPaid: s.feesPaid,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      ...teachers.map((t) => ({
        _id: t._id,
        type: "teacher",
        user: t.user,
        subjects: t.subjects,
        classes: t.classes,
        teacherId: t.teacherId,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    ];

    res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// add teachers
router.post('/add-teacher', async (req, res) => {
  try {
    const { name, email, password, subjects, teacherId, classes } = req.body;
    console.log('Incoming teacher data:', req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Create User (role: teacher)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'teacher'
    });
    console.log('User created:', user._id);

    // Create Teacher linked to User
    const teacher = await Teacher.create({
      user: user._id,
      subjects,// array of strings
      teacherId,
      classes   // array of strings
    });
    console.log('Teacher created:', teacher._id);

    res.status(201).json({ user, teacher });

  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// POST /api/students
router.post('/add-student', async (req, res) => {
  try {
    const { name, email, password, rollNumber, className } = req.body;
    console.log('Incoming data:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    });
    console.log('User created:', user._id);

    const student = await Student.create({
      user: user._id,
      rollNumber,
      className
    });
    console.log('Student created:', student._id);

    res.status(201).json({ user, student });

  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// teacher : get student data
router.get("/get-student", async (req,res) => {
  try {
    const users = await Student.find({}, "-password").populate("user", "-password");
    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})


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

// Teacher: get teacher data
router.get("/get-teacher", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user", "-password");
    res.json(teachers);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

// Teacher: Post assignment/result/notice
router.post("/post", auth(["teacher"]), async (req, res) => {
  try {
    const { title, content, className, type, postedBy } = req.body;

    const post = new Post({
      title,
      content,
      className,
      type,
      postedBy
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