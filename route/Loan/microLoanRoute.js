const router = require("express").Router();
const {
  createMicroLoan,
} = require("../../controller/Loan/microLoanController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");

router
  .route("/microLoan")
  .post(verifyToken, verifyRefreshToken, createMicroLoan);

module.exports = router;
