import query from "../../config/db.js";

export async function getAllStudents(req, res) {
  try {
    // Fetch all students without their grades
    const allStudents = await query(`
        SELECT
          id as studentId,
          firstname,
          lastname,
          email
        FROM
          student
      `);

    res.status(200).json({
      success: true,
      message: "All students fetched successfully",
      allStudents,
    });
  } catch (err) {
    console.error("Error fetching all students:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
