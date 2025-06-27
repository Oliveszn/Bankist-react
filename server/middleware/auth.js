const jwt = require("jsonwebtoken");
// Required Auth Middleware - blocks if no valid token
const requireAuth = async (req, res, next) => {
  try {
    // Extract token from multiple sources
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id || decoded.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // Attach user data to request
    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

// Admin Auth Middleware - requires auth + admin role
const requireAdmin = async (req, res, next) => {
  // First run the requireAuth middleware
  requireAuth(req, res, (err) => {
    if (err) return next(err);

    // Check if user has admin role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  });
};

module.exports = {
  requireAuth,
  requireAdmin,
};
