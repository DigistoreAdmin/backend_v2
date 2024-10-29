const router = require("express").Router();
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const { createVehicleInsurance,updateInsuranceDetails } = require("../controller/vehicleInsuranceController");

router
  .route("/createVehicleInsurance")
  .post(verifyToken, verifyRefreshToken, createVehicleInsurance);
  router
  .route("/updateInsuranceDetails")
  .put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

module.exports = router;