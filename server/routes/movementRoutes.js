const express = require("express");
const {
  requestLoan,
  transferMoney,
} = require("../controller/movementController");
const { authMiddleware } = require("../controller/authController");
const router = express.Router();

router.post("/loan", authMiddleware, requestLoan);
router.post("/send", authMiddleware, transferMoney);

module.exports = router;
