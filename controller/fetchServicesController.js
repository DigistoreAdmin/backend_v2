const panCardUsers = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const kswift = require("../db/models/kswift");
const defineStaffsDetails = require("../db/models/staffs");

const getPancardDetails = async (req, res) => {
  try {
    const user = req.user;
    const { sort, page, pageLimit, pantype, isDuplicateOrChange } = req.query;

    console.log("req.query", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    let where = {}

    if(pantype === "duplicateOrChangePancard") {
        where = { panType: pantype};   
        if(isDuplicateOrChange){
          where = { panType: pantype, isDuplicateOrChangePan: isDuplicateOrChange };
        } 
    } 
    else if(pantype){
      where = { panType : pantype}
     }

    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    const PancardUser = panCardUsers();

    const data = await PancardUser.findAndCountAll({
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
    console.error("Error fetching pancard details:", error);
    res.status(500).json({ error: "Failed to fetch pancard details" });
  }
};


const fetchPassport = catchAsync(async (req, res, next) => {
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

  const Passport = await definePassportDetails();
  const getPassport = await Passport.findAndCountAll({
    where,
    limit,
    offset,
  });
  if (!getPassport) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getPassport.rows,
    totalPages: Math.ceil(getPassport.count / limit),
    totalItems: getPassport.count,
    currentPage: pageNumber,
  });
});

const fetchKswift = catchAsync(async (req, res, next) => {
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

  const getKswift = await kswift.findAndCountAll({
    where,
    limit,
    offset,
  });
  if (!getKswift) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getKswift.rows,
    totalPages: Math.ceil(getKswift.count / limit),
    totalItems: getKswift.count,
    currentPage: pageNumber,
  });
});

const fetchStaffs = catchAsync(async (req, res, next) => {
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

  const staff = await defineStaffsDetails();

  const getStaff = await staff.findAndCountAll({
    limit,
    offset,
  });
  if (!getStaff) {
    return next(new AppError("Data not found", 404));
  }

  res.status(200).json({
    data: getStaff.rows,
    totalPages: Math.ceil(getStaff.count / limit),
    totalItems: getStaff.count,
    currentPage: pageNumber,
  });
});

module.exports = { fetchPassport, fetchKswift, fetchStaffs,getPancardDetails };