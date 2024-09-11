const {
  createNewVehicleLoan,
} = require("../../controller/Loan/vehicleLoanNewController");
const {
  getAllNewVehicleLoans,
} = require("../../controller/Loan/getVehicleLoanNew");
const {
  createUsedVehicleLoan,
  getAllUsedVehicleLoans,
} = require("../../controller/Loan/vehicleLoanUsedController");
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
