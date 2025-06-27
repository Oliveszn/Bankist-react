const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const db = require("../db");

//register a user
const registerUser = async (req, res) => {
  const client = await db.connect();
  const { firstname, lastname, username, password } = req.body;
  try {
    await client.query("BEGIN");
    if (![firstname, lastname, username, password].every(Boolean)) {
      return res.status(401).json({ error: "missing fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists, Try another",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //creating new user after all checks
    const newUser = await User.create({
      firstname,
      lastname,
      username,
      password: hash,
    });

    await db.query(
      `INSERT INTO movements (user_id, amount, type, description)
       VALUES ($1, $2, $3, $4)`,
      [newUser.id, 5000.0, "deposit", "Welcome bonus"]
    );

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await client.query("COMMIT");

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: "Account created with ₦5000 welcome bonus!",
        user: {
          id: newUser.id,
          firstname: newUser.firstname,
          username: newUser.username,
          balance: newUser.balance,
        },
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  } finally {
    client.release();
  }
};

////login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findByUsername(username);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkPasswordMatch = await User.comparePassword(
      password,
      existingUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        samesite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      //  secure: process.env.NODE_ENV === 'production', // Should be true in prod
      .json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          id: existingUser.id,
          username: existingUser.username,
          firstname: existingUser.firstname,
          balance: existingUser.balance,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/////logout
const logout = (req, res) => {
  try {
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteAccount = async (req, res) => {
  const { username } = req.body;
  try {
    const existingUser = await User.findByUsername(username);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // const checkPasswordMatch = await User.comparePassword(
    //   password,
    //   existingUser.password
    // );
    // if (!checkPasswordMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }

    const deleted = await User.delete(username);
    if (!deleted) {
      throw new Error("Failed to delete user");
    }

    res.clearCookie("session_token");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could not delete",
    });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    // Try to get token from either cookies or Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "") ||
      req.headers["x-access-token"];

    // if (!token) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Authentication required",
    //   });
    // }
    if (!token) {
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = {
  registerUser,
  loginUser,
  logout,
  deleteAccount,
  authMiddleware,
};
