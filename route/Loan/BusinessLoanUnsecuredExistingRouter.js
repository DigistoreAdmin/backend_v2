const {
  createBusinessLoanUnsecuredExisting,
} = require("../../controller/Loan/BusinessLoanUnsecuredExistingController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();
router
  .route("/createBusinessLoanUnsecuredExisting")
  .post(verifyToken, verifyRefreshToken, createBusinessLoanUnsecuredExisting);

module.exports = router;
