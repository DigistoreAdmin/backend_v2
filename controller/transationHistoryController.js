const { Sequelize } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const TransationHistory = require("../db/models/transationhistory");
const transationHistories = require("../db/models/transationhistory");
const Franchise = require("../db/models/franchise");

const transationHistoryAdmin = catchAsync(async (req, res, next) => {
  const { sort, filter, search, page, pageLimit } = req.query;
  console.log(req.query);
  const order = sort ? [[sort, "DESC"]] : [];
  console.log("Sort:", sort);
  console.log("Order:", order);
  const where = {};
  if (filter) {
    const filters = JSON.parse(filter);
    if (filters.userName) {
      where.userName = filters.userName;
    }
    if (filters.userType) {
      where.userType = filters.userType;
    }
    if (filters.service) {
      where.service = filters.service;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.amount) {
      where.amount = filters.amount;
    }
  }

  if (search) {
    const amount = parseFloat(search);
    where[Op.or] = [
      { userName: { [Op.iLike]: `%${search}%` } },
      { userType: { [Op.iLike]: `%${search}%` } },
      { service: { [Op.iLike]: `%${search}%` } },
    ];
    // Handle numeric 'amount'
    if (!isNaN(amount)) {
      where[Op.or].push(
        Sequelize.where(Sequelize.cast(Sequelize.col("amount"), "DECIMAL"), {
          [Op.eq]: amount,
        })
      );
    }
  }
  if (!page || !pageLimit) {
    return res.status(400).json({ error: "page and pageSize are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  try {
    const data = await TransationHistory.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    if (data.count === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "Page not Found" });
    }
    data.rows.forEach((row) => {
      row.password = "";
    });
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({ succes: "false", message: "Page not found" });
    }

    return res.json({
      status: "success",
      data: data,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const transactionHistoryFranchise = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;

    const Data = await Franchise.findOne({ where: { email: user.email } });
    if (!Data) {
      return res.status(404).json({ message: "Franchise not found" });
    }
    // console.log("Franchise ID:", Data.id);
    const data = await transationHistories.findAll({
      where: { uniqueId: Data.franchiseUniqueId },
    });

    console.log("Matching transactionHistories records of franchise", data);

    return res.status(200).json({ data: data, count: data.length });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  transationHistoryAdmin,
  transactionHistoryFranchise,
};
