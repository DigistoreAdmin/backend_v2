const {
    createHousingLoan,
  } = require("../../controller/Loan/HousingLoanController");
  const { verifyToken, verifyRefreshToken } = require("../../utils/token");
  
  const router = require("express").Router();
  router
    .route("/createHousingLoan")
    .post(verifyToken, verifyRefreshToken, createHousingLoan);
  
  module.exports = router;
  