const express = require("express");
const { loanStatus, trainBookingUpdate, updatePanDetails, incometaxUpdate } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken,loanStatus)

router.route("/updateTrainBooking").put(verifyToken,verifyRefreshToken,trainBookingUpdate)
router
  .route("/updatePanDetails")
  .put(verifyToken, verifyRefreshToken, updatePanDetails);

router
  .route("/incometaxUpdate")
  .put(verifyToken, verifyRefreshToken,incometaxUpdate)

  module.exports = router;