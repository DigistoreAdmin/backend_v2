const { busBooking } = require('../controller/busController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/busBooking').post(verifyToken, verifyRefreshToken, busBooking)

module.exports = router