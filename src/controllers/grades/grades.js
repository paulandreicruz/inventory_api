import query from "../../config/db.js";

export async function addGrade(req, res) {
  const { userId, subject, score } = req.body;

  try {
    // Check if the student exists
    const student = await query("SELECT * FROM student WHERE id = $1", [
      userId,
    ]);

    if (student.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Insert the new grade into the database
    const insertResult = await query(
      `INSERT INTO new_grade (userid, subject, score)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userId, subject, score]
    );

    res.status(201).json({
      success: true,
      message: "Grade added successfully",
      grade: insertResult[0],
    });
  } catch (err) {
    console.error("Error adding grade:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getStudentGrades(req, res) {
  const { userId } = req.params;

  try {
    // Fetch student grades for a specific user
    const grades = await query("SELECT * FROM new_grade WHERE userid = $1", [
      userId,
    ]);

    res.status(200).json({
      success: true,
      message: "Student grades fetched successfully",
      grades,
    });
  } catch (err) {
    console.error("Error fetching student grades:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getAllStudentsWithGrades(req, res) {
  try {
    // Fetch all students with their grades using raw PostgreSQL query
    const studentsWithGradesQuery = `
        SELECT
          student.id as studentId,
          student.firstname,
          student.lastname,
          student.email,
          new_grade.subject,
          new_grade.score
        FROM
          student
        LEFT JOIN
          new_grade ON student.id = new_grade.userid
      `;

    const studentsWithGrades = await query(studentsWithGradesQuery);

    // Organize the data to group grades by student
    const studentsData = studentsWithGrades.reduce((acc, student) => {
      const studentId = student.studentId;

      if (!acc[studentId]) {
        acc[studentId] = {
          id: studentId,
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
          grades: [],
        };
      }

      if (student.subject && student.score !== null) {
        acc[studentId].grades.push({
          subject: student.subject,
          score: student.score,
        });
      }

      return acc;
    }, {});

    const students = Object.values(studentsData);

    res.status(200).json({
      success: true,
      message: "All students with grades fetched successfully",
      students,
    });
  } catch (err) {
    console.error("Error fetching all students with grades:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
