const {
  currentMonthAnalysis,
} = require("../../controller/accountantController/currentMonthAnalysisController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router
  .route("/currentMonthAnalysis")
  .get(verifyToken, verifyRefreshToken, currentMonthAnalysis);

module.exports = router;
