const {
  sixMonthAnalysis,
} = require("../../controller/accountantController/sixMonthAnalysisController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router
  .route("/sixMonthAnalysis")
  .get(verifyToken, verifyRefreshToken, sixMonthAnalysis);

module.exports = router;
