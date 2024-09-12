const {
  fetchHousingLoan,
} = require("../../controller/Loan/fetchLoansController");

const { verifyToken, verifyRefreshToken } = require("../../utils/token");

const router = require("express").Router();

router
  .route("/fetchHousingLoan")
  .get(verifyToken, verifyRefreshToken, fetchHousingLoan);

module.exports = router;
