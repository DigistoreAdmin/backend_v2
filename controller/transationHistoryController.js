const { Sequelize, Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const TransationHistory = require("../db/models/transationhistory");
const transationHistories = require("../db/models/transationhistory");
const Franchise = require("../db/models/franchise");

const transationHistoryAdmin = catchAsync(async (req, res, next) => {
  try {
    const { sort, filter, search, page, pageLimit } = req.query;

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageSize query parameters are required" });
    }
    const where = {};
    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const searchValue = search ? JSON.parse(search) : null;
    const filterValue = filter ? JSON.parse(filter) : null;

    if (searchValue?.field) {
      const searchNumber = parseFloat(searchValue?.value);
      const searchDate = new Date(searchValue?.value);
      const startOfDay = new Date(searchDate?.setHours(0, 0, 0, 0));
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      where[Op.and] = [];

      if (searchValue.field === "userName") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.and].push({
          userName: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "service") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.and].push({
          service: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "uniqueId") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.and].push({
          uniqueId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "transactionId") {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.and].push({
          transactionId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }

      if (searchValue.field === "amount" && !isNaN(searchNumber)) {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.or].push({ amount: { [Op.eq]: searchNumber } });
      }

      if (searchValue.field === "createdAt" && !isNaN(searchDate.getTime())) {
        console.log("searchValue.field: ", searchValue.field);
        where[Op.and].push({
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        });
      }
    }

    if (filterValue?.filterBy !== "" && filterValue?.field !== "") {
      where[Op.and] = where[Op.and] || [];

      if (filterValue?.field === "service") {
        where[Op.and].push({
          service: {
            [Op.or]: filterValue.filterBy.map((value) => ({
              [Op.iLike]: `%${value}%`,
            })),
          },
        });
      }

      if (filterValue?.field === "status") {
        where[Op.and].push({
          status: {
            [Op.or]: filterValue.filterBy.map((value) => ({
              [Op.eq]: value,
            })),
          },
        });
      }
    }

    let order = [["createdAt", "DESC"]];
    const sortOrder = sort ? JSON.parse(sort) : [];

    if (sortOrder.field && sortOrder.order) {
      order = [[sortOrder.field, sortOrder.order]];
    }

    const data = await TransationHistory.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    data.rows.forEach((row) => {
      row.password = "";
    });

    if (data.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "No transactions found", data: data.rows });
    }

    return res.status(200).json({
      data: data.rows,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const transactionHistoryFranchise = catchAsync(async (req, res, next) => {
  try {
    const user = req.user;

    const { search, filter, sort, page, pageLimit } = req.query;

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
    const filterValue = filter ? JSON.parse(filter) : null;

    //searching
    if (searchValue?.field) {
      const searchNumber = parseFloat(searchValue?.value);
      const searchDate = new Date(searchValue?.value);
      const startOfDay = new Date(searchDate?.setHours(0, 0, 0, 0));
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      where[Op.and] = [];

      if (searchValue.field === "userName") {
        where[Op.and].push({
          userName: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "service") {
        where[Op.and].push({
          service: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "uniqueId") {
        where[Op.and].push({
          uniqueId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }
      if (searchValue.field === "transactionId") {
        where[Op.and].push({
          transactionId: { [Op.iLike]: `%${searchValue.value}%` },
        });
      }

      if (searchValue.field === "amount" && !isNaN(searchNumber)) {
        where[Op.and].push({ amount: { [Op.eq]: searchNumber } });
      }

      if (searchValue.field === "createdAt" && !isNaN(searchDate.getTime())) {
        where[Op.and].push({
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        });
      }
    }

    //filtering
    if (filterValue?.filterBy !== "" && filterValue?.field !== "") {
      where[Op.and] = where[Op.and] || [];

      if (filterValue?.field === "service") {
        where[Op.and].push({
          service: {
            [Op.or]: filterValue.filterBy.map((value) => ({
              [Op.iLike]: `%${value}%`,
            })),
          },
        });
      }

      if (filterValue?.field === "status") {
        where[Op.and].push({
          status: {
            [Op.or]: filterValue.filterBy.map((value) => ({
              [Op.eq]: value,
            })),
          },
        });
      }
    }

    //sorting based on feild value and order
    let order = [["createdAt", "DESC"]];
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
      return res
        .status(200)
        .json({ message: "No transactions found", data: data.rows });
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
