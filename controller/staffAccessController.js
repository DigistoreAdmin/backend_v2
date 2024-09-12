const catchAsync = require("../utils/catchAsync");
const defineStaffsDetails = require("../db/models/staffs");
const AppError = require("../utils/appError");

const staffAccess = catchAsync(async (req, res, next) => {
  const { blocked, employeeId } = req.body;
  const staffs = defineStaffsDetails();

  const staff = await staffs.findOne({ where: { employeeId } });

  if (!staff) {
    return next(new AppError("Staff not found", 404));
  }

  const updateAccess = await staffs.update(
    { blocked },
    { where: { employeeId } }
  );

  return res.status(201).json({
    message: "Access updated successfully",
    data: updateAccess,
  });
});

module.exports = { staffAccess };
