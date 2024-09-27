const express = require("express");
const {
  loanStatus,
  updatePanDetails,
} = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken, loanStatus);

router
  .route("/updatePanDetails")
  .put(verifyToken, verifyRefreshToken, updatePanDetails);

module.exports = router;
