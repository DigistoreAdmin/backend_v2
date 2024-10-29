const { busBooking, updateBusBooking } = require('../controller/busController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/busBooking').post(verifyToken, verifyRefreshToken, busBooking)

router.route("/updateBusBooking").put(verifyToken, verifyRefreshToken, updateBusBooking)

module.exports = router