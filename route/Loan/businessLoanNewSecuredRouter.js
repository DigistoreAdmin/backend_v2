const {
  createBusinessLoanNewSecured,
} = require("../../controller/Loan/businessLoanNewSecuredController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const router = require("express").Router();
router
  .route("/createBusinessLoanNewSecured")
  .post(verifyToken, verifyRefreshToken, createBusinessLoanNewSecured);

module.exports = router;
