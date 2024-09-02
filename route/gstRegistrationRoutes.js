const gstRegistrations = require('../controller/gstRegistrationController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/gstRegistrations').post(verifyToken, verifyRefreshToken, gstRegistrations)

module.exports = router