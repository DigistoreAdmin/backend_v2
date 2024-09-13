const {
  createNewVehicleLoan,
} = require("../../controller/Loan/vehicleLoanNewController");

const {
  createUsedVehicleLoan,
} = require("../../controller/Loan/vehicleLoanUsedController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const router = require("express").Router();

router
  .route("/newVehicleLoan")
  .post(verifyToken, verifyRefreshToken, createNewVehicleLoan);

router
  .route("/usedVehicleLoan")
  .post(verifyToken, verifyRefreshToken, createUsedVehicleLoan);

module.exports = router;
