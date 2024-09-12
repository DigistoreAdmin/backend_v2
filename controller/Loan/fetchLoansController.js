const Franchise = require("../../db/models/franchise");
const defineHousingLoan = require("../../db/models/HousingLoan");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const fetchHousingLoan = catchAsync(async (req, res, next) => {
  const { page, pageLimit } = req.query;

  if (!page || !pageLimit) {
    return res
      .status(400)
      .json({ error: "page and pageSize query parameters are required" });
  }

  const pageNumber = parseInt(page, 10);
  const pageLimitNumber = parseInt(pageLimit, 10);

  const limit = pageLimitNumber;
  const offset = (pageNumber - 1) * limit;

  const user = req.user;
  if (!user) {
    return next(new AppError("User not found", 401));
  }
  const franchise = await Franchise.findOne({
    where: { email: user.email },
  });

  if (!franchise) {
    return next(new AppError("Franchise not found", 404));
  }

  if (!franchise.franchiseUniqueId) {
    return next(new AppError("Missing unique id for the franchise", 400));
  }

  const where = { uniqueId: franchise.franchiseUniqueId };

  const HousingLoan = await defineHousingLoan();
  const getHousingLoan = await HousingLoan.findAndCountAll({
    where,
    limit,
    offset,
  });
  if (!getHousingLoan) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getHousingLoan.rows,
    totalPages: Math.ceil(getHousingLoan.count / limit),
    totalItems: getHousingLoan.count,
    currentPage: pageNumber,
  });
});

module.exports = { fetchHousingLoan };
