const express = require('express')
const router = express.Router()
const { verifyToken, verifyRefreshToken } = require("../../utils/token");
const { bookFlightTicket, flightAirports, flightList, flightDetails, blockFlight, flightLatestFair } = require('../../controller/rechapi-controllers/flightTicketController');

router.route("/flightAirports").post(verifyToken, verifyRefreshToken, flightAirports)
router.route("/flightList").post(verifyToken, verifyRefreshToken, flightList)
router.route("/flightDetails").post(verifyToken, verifyRefreshToken, flightDetails)
router.route("/blockFlight").post(verifyToken, verifyRefreshToken, blockFlight)
router.route("/flightLatestFair").post(verifyToken, verifyRefreshToken, flightLatestFair)
router.route("/bookFlightTicket").post(verifyToken, verifyRefreshToken, bookFlightTicket)

module.exports = router
