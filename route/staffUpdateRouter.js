const express = require("express");
const { loanStatus, trainStatus, busStatus } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken,loanStatus)

router
  .route("/trainStatus")
  .put(verifyToken,verifyRefreshToken, trainStatus)

  router
  .route("/busStatus")
  .put(verifyToken,verifyRefreshToken, busStatus)

  module.exports = router;