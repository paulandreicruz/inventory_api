import express from "express";
import { getAllStudents } from "../controllers/students/student.js";
const router = express.Router();

router.get("/students", getAllStudents);

export default router;
