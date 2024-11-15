const express = require("express");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const {
  getPancardDetails,
  fetchPassport,
  fetchKswift,
  fetchStaffs,
  getBusBookings,
  getFssaiRegistrations,
  getFssaiLicence,
  getGstRegistrations,
  getGstFilings,
  getIncomeTaxFilings,
  getPartnerShipDeedPreparation,
  getPackingLicences,
  fetchTrainBookingDetails,
  fetchUdyamRegistrationDetails,
  fetchFinancialStatements,
  fetchCompanyFormationDetails,
  getVehicleInsurance,
  getAllWorks,
  getAllWorksByStaffId
} = require("../controller/fetchServicesController");


const route = express.Router();

route.get(
  "/getPancardDetails",
  verifyToken,
  verifyRefreshToken,
  getPancardDetails
);

route
  .route("/fetchPassport")
  .get(verifyToken, verifyRefreshToken, fetchPassport);

route.route("/fetchKswift").get(verifyToken, verifyRefreshToken, fetchKswift);
route
  .route("/getBusBooking")
  .get(verifyToken, verifyRefreshToken, getBusBookings);
route
  .route("/getFssaiRegistrations")
  .get(verifyToken, verifyRefreshToken, getFssaiRegistrations);
route
  .route("/getFssaiLicence")
  .get(verifyToken, verifyRefreshToken, getFssaiLicence);
route
  .route("/getGstRegistrations")
  .get(verifyToken, verifyRefreshToken, getGstRegistrations);
route
  .route("/getGstFilings")
  .get(verifyToken, verifyRefreshToken, getGstFilings);
route
  .route("/getIncomeTax")
  .get(verifyToken, verifyRefreshToken, getIncomeTaxFilings);
route
  .route("/getPartnerShipDeedPreparation")
  .get(verifyToken, verifyRefreshToken, getPartnerShipDeedPreparation);
route
  .route("/getPackingLicences")
  .get(verifyToken, verifyRefreshToken, getPackingLicences);

route.route("/getTrainBooking").get(verifyToken, verifyRefreshToken,fetchTrainBookingDetails);
route.route("/getUdyamRegistration").get(verifyToken, verifyRefreshToken,fetchUdyamRegistrationDetails);
route.route("/getFinancialStatements").get(verifyToken, verifyRefreshToken,fetchFinancialStatements);
route.route("/getCompanyFormationDetails").get(verifyToken, verifyRefreshToken,fetchCompanyFormationDetails);
route.route("/getVehicleInsurance").get(verifyToken, verifyRefreshToken, getVehicleInsurance);


route.route("/getAllWorks").get(verifyToken,verifyRefreshToken,getAllWorks)
route.route("/getAllWorksByStaffId").get(verifyToken,verifyRefreshToken,getAllWorksByStaffId)

module.exports = route;
