const Franchise = require("../db/models/franchise");
const User = require("../db/models/user");
const defineStaffsDetails = require("../db/models/staffs");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const isBlock = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log("13", user);
  const Staff = defineStaffsDetails();
  const Data =
    (await Franchise.findOne({where:{ email: user.email }})) ||
    (await Staff.findOne({where:{ emailId: user.email }})) ||
    (await User.findOne({where:{ email: user.email }}));

  if (!Data) {
    return next(new AppError("User not found", 404));
  }
  console.log("14", Data);

  console.log("15", Data.blocked);
  
  if (Data.blocked === "blocked") {
    return next(new AppError("You are blocked by admin", 403));
  }
  next(); 
});

module.exports = { isBlock };
