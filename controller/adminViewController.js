const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");

const getAllFranchises = catchAsync(async (req, res, next) => {
  const { sort, filter, search, page, pageLimit } = req.query;
  console.log(req.query);
  const order = sort ? [[sort, "DESC"]] : [];
  //   console.log("Sort:", sort);
  //   console.log("Order:", order);
  const where = {};
  if (filter) {
    const filters = JSON.parse(filter);
    if (filters.ownerName) {
      where.ownerName = filters.ownerName;
    }
    if (filters.franchiseName) {
      where.franchiseName = filters.franchiseName;
    }
    if (filters.userPlan) {
      where.userPlan = filters.userPlan;
    }
    if (filters.phoneNumber) {
      where.phoneNumber = filters.phoneNumber;
    }
  }

  const phoneNumber = parseFloat(search);

  if (search) {
    where[Op.or] = [
      { ownerName: { [Op.iLike]: `%${search}%` } },
      { franchiseName: { [Op.iLike]: `%${search}%` } },
      //   { phoneNumber: { [Op.iLike]: `%${search}%` } },
    ];
    if (!isNaN(phoneNumber)) {
      where[Op.or].push({ phoneNumber: { [Op.eq]: phoneNumber } });
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
    const data = await Franchise.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });
    if (data.count === 0) {
      return res.status(404).json({ succes:'false', message: "No data to display" });
    }
    data.rows.forEach((row) => {
      row.password = "";
    });
    if (data.rows.length === 0) {
      return res.status(404).json({succes:'false', message: "No data to display" });
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

module.exports = { getAllFranchises };
