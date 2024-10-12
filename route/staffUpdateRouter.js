const express = require("express");
const { loanStatus, trainBookingUpdate, updateInsuranceDetails } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken,loanStatus)

router.route("/updateTrainBooking").put(verifyToken,verifyRefreshToken,trainBookingUpdate)

router
  .route("/updateInsuranceDetails")
  .put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

  module.exports = router;