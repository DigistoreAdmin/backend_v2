const express = require("express");
const { loanStatus, trainBookingUpdate, updateGstDetails, updateInsuranceDetails, incometaxUpdate } = require("../controller/staffUpdateController");


const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken,loanStatus)

router.route("/updateTrainBooking").put(verifyToken,verifyRefreshToken,trainBookingUpdate)

router.route("/updateGstDetails").put(verifyToken, verifyRefreshToken, updateGstDetails);

router.route("/updateInsuranceDetails").put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

router.route("/incometaxUpdate").put(verifyToken, verifyRefreshToken,incometaxUpdate)

module.exports = router;


