const { Sequelize ,Op} = require("sequelize");
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

    const { search, filter, sort, page, pageLimit } = req.query;
    console.log("req.query: ", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageSize query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const franchise = await Franchise.findOne({ where: { email: user.email } });
    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    const where = { uniqueId: franchise.franchiseUniqueId };
    const searchValue = search ? JSON.parse(search) : null;

    if (searchValue?.field) {
      const searchNumber = parseFloat(searchValue?.value);
      const searchDate = new Date(searchValue?.value);
      const startOfDay = new Date(searchDate?.setHours(0, 0, 0, 0));
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      where[Op.or] = [];

      if (searchValue.field === "userName") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({
          userName: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "service") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({
          service: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "uniqueId") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({
          uniqueId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "transactionId") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({
          transactionId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }

      if (searchValue.field === "amount" && !isNaN(searchNumber)) {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({ amount: { [Op.eq]: searchNumber } });
      }

      if (searchValue.field === "createdAt" && !isNaN(searchDate.getTime())) {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        });
      }
    }

    if (filter) {
      const filters = JSON.parse(filter);
      if (filters.userName) {
        where.userName = filters.userName;
      }
      if (filters.service) {
        where.service = filters.service;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.amount) {
        if (typeof filters.amount === "object") {
          where.amount = filters.amount;
        } else {
          where.amount = filters.amount;
        }
      }
    }

    //sorting based on feild value and order
    let order = [];
    const sortOrder = sort ? JSON.parse(sort) : [];
    if (sortOrder.field && sortOrder.order) {
      order = [[sortOrder.field, sortOrder.order]];
    }

    const data = await transationHistories.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({
      data: data.rows,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching transaction histories:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  transationHistoryAdmin,
  transactionHistoryFranchise,
};
