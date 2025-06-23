const express = require("express");
const { getUser, getMovements } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/get/:id", authMiddleware, getUser);
router.get("/:id", authMiddleware, getMovements);

module.exports = router;
