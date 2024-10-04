const express = require("express");
const { loanStatus, trainBookingUpdate } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken,loanStatus)

  router.route("/updateTrainBooking").put(verifyToken, verifyRefreshToken, trainBookingUpdate);  


  module.exports = router;