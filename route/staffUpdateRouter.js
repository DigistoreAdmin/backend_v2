const express = require("express");
const { loanStatus, updatePanDetails, updateGstDetails, updateInsuranceDetails, incometaxUpdate, updateBusBooking } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken,loanStatus)



router.route("/updateBusBooking").put(verifyToken, verifyRefreshToken, updateBusBooking)

router.route("/updateGstDetails").put(verifyToken, verifyRefreshToken, updateGstDetails);

router.route("/updatePanDetails").put(verifyToken, verifyRefreshToken, updatePanDetails);

router.route("/updateInsuranceDetails").put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

router.route("/incometaxUpdate").put(verifyToken, verifyRefreshToken,incometaxUpdate)

module.exports = router;


