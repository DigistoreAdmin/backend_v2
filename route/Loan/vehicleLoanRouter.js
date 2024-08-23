const {
  createNewVehicleLoan,
} = require("../../controller/Loan/vehicleLoanNewController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const router = require("express").Router();

router
  .route("/newVehicleLoan")
  .post(verifyToken, verifyRefreshToken, createNewVehicleLoan);

module.exports = router;
