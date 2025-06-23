const express = require("express");
const { getUser, getMovements } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/get", authMiddleware, getUser);
router.get("/", authMiddleware, getMovements);

module.exports = router;
