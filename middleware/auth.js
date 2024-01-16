import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Replace with your actual secret key

    // Attach the decoded user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error during token verification:", err);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
}

// Middleware to require student authentication
export function requireStudentAuth(req, res, next) {
  const user = req.user;

  if (user && user.isStudent) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized - Student access only" });
  }
}

// Middleware to require non-student authentication
export function requireNonStudentAuth(req, res, next) {
  const user = req.user;

  if (user && !user.isStudent) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized - Non-student access only",
      });
  }
}
