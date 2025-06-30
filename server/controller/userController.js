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
    ///page is the pages like cuurent page
    ///limit is how many items you want to show on a particular page
    ///offset is how many items you skip when youre on a particular page,
    const userId = req.user.id;
    const {
      page = 1,
      limit = 7,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    const movements = await User.getMovements(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      count: movements.movements.length,
      currentPage: movements.currentPage,
      totalPages: movements.totalPages,
      totalCount: movements.totalCount,
      data: movements.movements,
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
