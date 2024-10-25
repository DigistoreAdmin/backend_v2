const express = require("express");
const { loanStatus, trainBookingUpdate, updatePanDetails, updateGstDetails, updateInsuranceDetails, incometaxUpdate, updateBusBooking } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken,loanStatus)

router.route("/updateTrainBooking").put(verifyToken,verifyRefreshToken,trainBookingUpdate)

router.route("/updateBusBooking").put(verifyToken, verifyRefreshToken, updateBusBooking)

router.route("/updateGstDetails").put(verifyToken, verifyRefreshToken, updateGstDetails);

router.route("/updatePanDetails").put(verifyToken, verifyRefreshToken, updatePanDetails);

router.route("/updateInsuranceDetails").put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

module.exports = router;


