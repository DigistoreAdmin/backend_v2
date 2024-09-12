const express = require('express')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const { getPancardDetails,fetchPassport,fetchKswift,fetchStaffs, fetchTrainBookingDetails, } = require('../controller/fetchServicesController')

const route = express.Router()

route.get('/getPancardDetails', verifyToken,verifyRefreshToken,getPancardDetails)

route
  .route("/fetchPassport")
  .get(verifyToken, verifyRefreshToken, fetchPassport);

route.route("/fetchKswift").get(verifyToken, verifyRefreshToken, fetchKswift);
route.route("/fetchStaffs").get(verifyToken, verifyRefreshToken, fetchStaffs);

route.route("/getTrainBooking").get(verifyToken, verifyRefreshToken,fetchTrainBookingDetails);

module.exports = route;
