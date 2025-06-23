const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  deleteAccount,
} = require("../controller/authController");

const router = express.Router();

// signup route
router.post("/register", registerUser);

//login route
router.post("/login", loginUser);

// logout route
router.post("/logout", logout);

router.post("/delete", deleteAccount);

module.exports = router;
