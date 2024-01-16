import query from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req, res, isStudent) {
  const { password, firstname, lastname, middlename, email } = req.body;

  try {
    // Check if the user with the given email already exists
    const existingUser = await query(
      `SELECT * FROM ${isStudent ? "student" : "teacher"} WHERE email = $1`,
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(405).json({
        message: isStudent
          ? "Student already exists"
          : "Teacher already exists",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertResult = await query(
      `INSERT INTO ${isStudent ? "student" : "teacher"} 
      (firstname, lastname, middlename, email, password, isstudent, createdat)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        firstname,
        lastname,
        middlename,
        email,
        hashedPassword,
        isStudent,
        new Date(),
      ]
    );

    res.status(201).json({
      success: true,
      message: isStudent
        ? "Student registered successfully"
        : "Teacher registered successfully",
      user: insertResult[0],
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

function generateToken(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email, isStudent: user.isstudent },
    "your-secret-key", // Replace with your actual secret key
    { expiresIn: "1h" } // Token expires in 1 hour
  );
  return token;
}

export async function login(req, res, isStudent) {
  const { email, password } = req.body;

  try {
    // Retrieve user from the database based on email
    const user = await query(
      `SELECT * FROM ${isStudent ? "student" : "teacher"} WHERE email = $1`,
      [email]
    );

    // Check if the user exists and the password matches
    if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
      const token = generateToken(user[0]);

      res.status(200).json({
        success: true,
        message: isStudent
          ? "Student login successful"
          : "Teacher login successful",
        user: user[0],
        token: token, // Include the generated token in the response
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Usage examples
export async function registerStudent(req, res) {
  return registerUser(req, res, true);
}

export async function registerTeacher(req, res) {
  return registerUser(req, res, false);
}

export async function loginStudent(req, res) {
  return login(req, res, true);
}

export async function loginTeacher(req, res) {
  return login(req, res, false);
}
