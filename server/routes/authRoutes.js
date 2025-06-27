const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  deleteAccount,
  authMiddleware,
} = require("../controller/authController");

const router = express.Router();

// signup route
router.post("/register", registerUser);

//login route
router.post("/login", loginUser);

// logout route
router.post("/logout", logout);

router.post("/delete", deleteAccount);

router.get("/checkAuth", authMiddleware, (req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  }
  res.status(200).json({
    success: false,
    message: "No user authenticated",
  });
});

module.exports = router;
