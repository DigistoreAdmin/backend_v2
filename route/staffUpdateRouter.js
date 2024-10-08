const express = require("express");
const {
  loanStatus,
  updateGstDetails,
} = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken, loanStatus);

router
  .route("/updateGstDetails")
  .put(verifyToken, verifyRefreshToken, updateGstDetails);

module.exports = router;
