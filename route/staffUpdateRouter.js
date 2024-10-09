const express = require("express");
const {
  loanStatus,
  updateInsuranceDetails,
} = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken, loanStatus);

router
  .route("/updateInsuranceDetails")
  .put(verifyToken, verifyRefreshToken, updateInsuranceDetails);

module.exports = router;
