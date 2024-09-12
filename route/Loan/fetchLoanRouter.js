const express = require("express");
const {} = require("../../controller/Loan/LoanAgainstPropertyController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const {
  getLoanAgainstProperty,
  getBusinessLoanUnsecuredExisting,
  fetchHousingLoan,
  fetchBusinessLoanNewSecured,
} = require("../../controller/Loan/fetchLoansController");

const route = express.Router();

route.get(
  "/getLoanAgainstProperty",
  verifyToken,
  verifyRefreshToken,
  getLoanAgainstProperty
);
route.get(
  "/getBusinessLoanUnsecuredExisting",
  verifyToken,
  verifyRefreshToken,
  getBusinessLoanUnsecuredExisting
);

route
  .route("/fetchHousingLoan")
  .get(verifyToken, verifyRefreshToken, fetchHousingLoan);

route
  .route("/fetchBusinessLoanNewSecured")
  .get(verifyToken, verifyRefreshToken, fetchBusinessLoanNewSecured);

module.exports = route;
