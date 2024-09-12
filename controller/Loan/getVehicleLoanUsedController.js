const catchAsync = require("../../utils/catchAsync");
const usedVehicleLoan = require("../../db/models/vehicleloanused");

const getAllUsedVehicleLoans = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const maxLimit = 100;
  if (limit > maxLimit) limit = maxLimit;

  const offset = (page - 1) * limit;

  const usedVehicleData = usedVehicleLoan();
  const vehicleLoans = await usedVehicleData.findAll({
    limit: limit,
    offset: offset,
  });

  const totalCount = await usedVehicleData.count();

  if (!vehicleLoans || vehicleLoans.length === 0) {
    return res.status(404).json({
      status: "Not Found",
      message: "No vehicle loans found",
    });
  }

  return res.status(200).json({
    status: "Success",
    data: vehicleLoans,
    pagination: {
      page: page,
      limit: limit,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

module.exports = { getAllUsedVehicleLoans };
