const express = require("express");
const { getUser, getMovements } = require("../controller/userController");
const { authMiddleware } = require("../controller/authController");

const router = express.Router();

router.get("/get", authMiddleware, getUser);
router.get("/", authMiddleware, getMovements);

module.exports = router;
