const {
  createNewVehicleLoan,
} = require("../../controller/Loan/vehicleLoanNewController");
const {
  getAllNewVehicleLoans,
} = require("../../controller/Loan/getVehicleLoanNewController");
const {
  createUsedVehicleLoan,
} = require("../../controller/Loan/vehicleLoanUsedController");
const {
  getAllUsedVehicleLoans,
} = require("../../controller/Loan/getVehicleLoanUsedController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const router = require("express").Router();

router
  .route("/newVehicleLoan")
  .post(verifyToken, verifyRefreshToken, createNewVehicleLoan);

router
  .route("/newVehicleLoan")
  .get(verifyToken, verifyRefreshToken, getAllNewVehicleLoans);

router
  .route("/usedVehicleLoan")
  .post(verifyToken, verifyRefreshToken, createUsedVehicleLoan);

router
  .route("/usedVehicleLoan")
  .get(verifyToken, verifyRefreshToken, getAllUsedVehicleLoans);

module.exports = router;
