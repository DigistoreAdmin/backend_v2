const { kswiftBooking } = require('../controller/kswiftController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/kswiftBooking').post(verifyToken, verifyRefreshToken, kswiftBooking)

module.exports = router