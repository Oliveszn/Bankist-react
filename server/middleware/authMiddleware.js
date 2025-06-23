const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = async (req, res, next) => {
  // Try to get token from either cookies or Authorization header
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "") ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Flexible ID checking (supports both 'id' and 'userId')
    // Check for required claims
    if (!decoded.userId) {
      throw new Error("Token missing required claims");
    }
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };

    return next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    // Clear cookie if exists
    res.clearCookie("token");

    const message =
      error.name === "TokenExpiredError"
        ? "Session expired, please login again"
        : "Invalid authentication";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

module.exports = authMiddleware;
