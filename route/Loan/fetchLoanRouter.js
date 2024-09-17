const express = require("express");
const { } = require("../../controller/Loan/LoanAgainstPropertyController");
const { verifyToken, verifyRefreshToken } = require("../../utils/token");


const {
  getLoanAgainstProperty,
  getBusinessLoanUnsecuredExisting,
  fetchHousingLoan,
  fetchBusinessLoanNewSecured,
  getPersonalLoanDetails,
  getBusinessUnsecuredNewLoanDetails,
  getAllNewVehicleLoans,
  getAllUsedVehicleLoans,
  getBusinessLoanExisting
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
  .route("/getPersonalLoanDetails")
  .get(verifyToken, verifyRefreshToken, getPersonalLoanDetails);
route
  .route("/getBusinessUnsecuredNewLoanDetails")
  .get(verifyToken, verifyRefreshToken, getBusinessUnsecuredNewLoanDetails);


route
  .route("/fetchBusinessLoanNewSecured")
  .get(verifyToken, verifyRefreshToken, fetchBusinessLoanNewSecured);

route
  .route("/getBusinessLoanExisting")
  .get(verifyToken, verifyRefreshToken, getBusinessLoanExisting);

route  
  .route("/newVehicleLoan")
  .get(verifyToken, verifyRefreshToken, getAllNewVehicleLoans);

route
  .route("/usedVehicleLoan")
  .get(verifyToken, verifyRefreshToken, getAllUsedVehicleLoans);


module.exports = route;
