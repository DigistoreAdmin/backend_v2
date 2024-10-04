const express = require("express");
const { loanStatus, updateBusBooking } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken, loanStatus)

router
  .route("/updateBusBooking")
  .put(verifyToken, verifyRefreshToken, updateBusBooking)


module.exports = router;