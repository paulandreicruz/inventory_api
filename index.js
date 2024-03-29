import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoutes from "./routes/auth.js";
import GradeRoutes from "./routes/grades.js";
import StudentRoutes from "./routes/student.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello vercel!");
});

app.use("/api/v1", AuthRoutes);
app.use("/api/v1", GradeRoutes);
app.use("/api/v1", StudentRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
