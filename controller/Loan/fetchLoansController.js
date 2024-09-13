const loanAgainstProperty = require("../../db/models/loanAgainstProperty");
const defineBusinessLoanUnscuredExisting = require("../../db/models/BusinessLoanUnsecuredExisting");
const defineHousingLoan = require("../../db/models/HousingLoan");
const defineBusinessLoanNewSecured = require("../../db/models/businessLoanNewSecured");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Franchise = require("../../db/models/franchise");
const definePersonalLoan = require("../../db/models/personalloan");
const defineBusinessLoanUnsecuredNew = require("../../db/models/businessloanunsecurednew");

const getLoanAgainstProperty = catchAsync(async (req, res, next) => {
  try {
    const { page, pageLimit, sort } = req.query;

    console.log("Query", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameterr required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const user = req.user;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    if (!franchise) {
      return next(new AppError("Franchise not found", 404));
    }

    if (!franchise.franchiseUniqueId) {
      return next(new AppError("Missing usnique id for the franchise", 404));
    }

    const where = { uniqueId: franchise.franchiseUniqueId };

    const LoanAgainstProperties = loanAgainstProperty();

    const data = await LoanAgainstProperties.findAndCountAll({
      where: where,
      limit,
      offset,
      order: sort ? [[sort, "ASC"]] : undefined,
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
    console.log("Error fetching Loan details:", error);
    res.status(500).json({ error: " Failed to fetch loan details" });
  }
});

const getBusinessLoanUnsecuredExisting = catchAsync(async (req, res, next) => {
  try {
    const { page, pageLimit, sort } = req.query;

    console.log("Query", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameterr required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const user = req.user;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    if (!franchise) {
      return next(new AppError("Franchise not found", 404));
    }

    if (!franchise.franchiseUniqueId) {
      return next(new AppError("Missing usnique id for the franchise", 404));
    }

    const where = { uniqueId: franchise.franchiseUniqueId };

    const BusinessLoan = defineBusinessLoanUnscuredExisting();

    const data = await BusinessLoan.findAndCountAll({
      where: where,
      limit,
      offset,
      order: sort ? [[sort, "ASC"]] : undefined,
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
    console.log("Error fetching Loan details:", error);
    res.status(500).json({ error: " Failed to fetch loan details" });
  }
});

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

  const HousingLoan = await defineHousingLoan();
  const getHousingLoan = await HousingLoan.findAndCountAll({
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

const getPersonalLoanDetails = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;
    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const personalLoan = definePersonalLoan();
    const Data = await personalLoan.findAndCountAll({
      limit,
      offset,
    });
    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const getBusinessUnsecuredNewLoanDetails = catchAsync(async (req, res) => {
  try {
    const { page, pageLimit } = req.query;
    if (!page || !pageLimit) {
      return res.status(400).json({ error: "page and pageSize are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const businessLoanunsecuredNew = defineBusinessLoanUnsecuredNew();
    const Data = await businessLoanunsecuredNew.findAndCountAll({
      limit,
      offset,
    });
    return res.json({
      status: "success",
      data: Data,
      totalItems: Data.count,
      totalPages: Math.ceil(Data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error:", error);
    return next(new AppError(error.message, 500));
  }
});

const fetchBusinessLoanNewSecured = catchAsync(async (req, res, next) => {
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

  const BusinessLoanNewSecured = await defineBusinessLoanNewSecured();
  const getBusinessLoanNewSecured =
    await BusinessLoanNewSecured.findAndCountAll({
      limit,
      offset,
    });
    
  if (!getBusinessLoanNewSecured) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getBusinessLoanNewSecured.rows,
    totalPages: Math.ceil(getBusinessLoanNewSecured.count / limit),
    totalItems: getBusinessLoanNewSecured.count,
    currentPage: pageNumber,
  });
});

module.exports = {
  getLoanAgainstProperty,
  getBusinessLoanUnsecuredExisting,
  fetchHousingLoan,
  fetchBusinessLoanNewSecured,
  getPersonalLoanDetails,
  getBusinessUnsecuredNewLoanDetails,
};
