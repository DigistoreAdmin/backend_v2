const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { createVehicleInsurance } = require("../controller/vehicleInsuranceController");

router
  .route("/createVehicleInsurance")
  .post(verifyToken, verifyRefreshToken, createVehicleInsurance);

module.exports = router;