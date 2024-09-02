const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const {
  createCibilReport,
} = require("../../controller/Loan/cibilReportController");
const router = express.Router();

router
  .route("/cibilReport")
  .post(verifyToken, verifyRefreshToken, createCibilReport);

module.exports = router;
