import express from "express";
import { Router } from "express";
import {home, login, adduser} from "../controllers/auth-controller.js"

const router = express.Router();

router.get("/", home);
router.get("/login", login)
router.post("/add-usr", adduser);

export default router;