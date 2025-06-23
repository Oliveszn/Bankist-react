const User = require("../models/Users");
const db = require("../db");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findByUserId(id);
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
    const { id } = req.params;
    const movements = await User.getMovements(id);

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
