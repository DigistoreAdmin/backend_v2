const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const {
  createCibilReport,
  getCibilReports,
  getAllCibilReports
} = require("../../controller/Loan/cibilReportController");
const router = express.Router();

router
  .route("/cibilReport")
  .post(verifyToken, verifyRefreshToken, createCibilReport);

router
  .route("/getAllCibilReports")
  .get(verifyToken, verifyRefreshToken, getAllCibilReports);

router.route("/cibilReportStatus").get(verifyToken, verifyRefreshToken, getCibilReports)

module.exports = router;
