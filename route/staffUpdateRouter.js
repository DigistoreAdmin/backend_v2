const express = require("express");
const {
  loanStatus,
  passportUpdate,
} = require("../controller/staffUpdateController");

const { verifyRefreshToken, verifyToken } = require("../utils/token");

const router = express.Router();

router.route("/loanStatus").put(verifyToken, verifyRefreshToken, loanStatus);
router
  .route("/passportUpdate")
  .put(verifyToken, verifyRefreshToken, passportUpdate);

module.exports = router;
