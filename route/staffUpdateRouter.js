const express = require("express");
const { loanStatus, incometaxUpdate } = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router
  .route("/loanStatus")
  .put(verifyToken, verifyRefreshToken,loanStatus)

router
  .route("/incometaxUpdate")
  .put(verifyToken, verifyRefreshToken,incometaxUpdate)

  module.exports = router;