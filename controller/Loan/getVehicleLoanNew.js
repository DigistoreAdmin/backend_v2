const catchAsync = require("../../utils/catchAsync");
const newVehicleLoan = require("../../db/models/vehicleloanused");

const getAllNewVehicleLoans = catchAsync(async (req, res, next) => {
  const usedVehicleData = newVehicleLoan();
  const vehicleLoans = await usedVehicleData.findAll();

  if (!vehicleLoans || vehicleLoans.length === 0) {
    return res.status(404).json({
      status: "Not Found",
      message: "No vehicle loans found",
    });
  }

  return res.status(200).json({
    status: "Success",
    data: vehicleLoans,
  });
});

module.exports = { getAllNewVehicleLoans };
