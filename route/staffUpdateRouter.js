const express = require("express");


const {
  loanStatus,
  updatePanDetails,
  passportUpdate,
  updateBusBooking,
  trainBookingUpdate
} = require("../controller/staffUpdateController");


const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken, loanStatus)

router
  .route("/updateBusBooking")
  .put(verifyToken, verifyRefreshToken, updateBusBooking)


module.exports = router;

  .route("/updatePanDetails")
  .put(verifyToken, verifyRefreshToken, updatePanDetails);

router
  .route("/passportUpdate")
  .put(verifyToken, verifyRefreshToken, passportUpdate);

  router.route("/updateTrainBooking").put(verifyToken, verifyRefreshToken, trainBookingUpdate);  


  module.exports = router;

