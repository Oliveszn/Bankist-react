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
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 5;
    // const skip = (page - 1) * limit;

    // const sortBy = req.query.sortBy || "createdAt";
    // const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    // const totalMovs = await movements.countDocuments();
    // const totalPages = Math.ceil(totalMovs / limit);

    // const sortObj = {};
    // sortObj[sortBy] = sortOrder;
    ///page is the pages like cuurent page
    ///limit is how many items you want to show on a particular page
    ///offset is how many items you skip when youre on a particular page,
    const userId = req.user.id;
    const {
      page = 1,
      limit = 2,
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
