import express from "express";
import {
  addGrade,
  getStudentGrades,
  getAllStudentsWithGrades,
} from "../controllers/grades/grades.js";

const router = express.Router();

router.post("/add-grade", addGrade);
router.get("/grades/student/:userId", getStudentGrades);
router.get("/students-with-grades", getAllStudentsWithGrades);

export default router;
