import express from "express";
import { registerUser, login } from "../controllers/authentication/auth.js";

const router = express.Router();

router.post("/register/student", (req, res) => registerUser(req, res, true));
router.post("/register/teacher", (req, res) => registerUser(req, res, false));
router.post("/login/student", (req, res) => login(req, res, true));
router.post("/login/teacher", (req, res) => login(req, res, false));

export default router;
