const User = require("../models/Users");
const db = require("../db");

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await User.findByUserId(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getMovements = async (req, res) => {
  try {
    const userId = req.user.id;
    const movements = await User.getMovements(userId);

    res.status(200).json({
      success: true,
      count: movements.length,
      data: movements,
    });
  } catch (error) {
    console.error("Error fetching movements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transaction history",
    });
  }
};

module.exports = { getUser, getMovements };
