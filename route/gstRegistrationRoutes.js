const {gstRegistration,updateGstDetails} = require('../controller/gstRegistrationController')
const { verifyToken, verifyRefreshToken } = require('../utils/token')
const router = require('express').Router()

router.route('/gstRegistrations').post(verifyToken, verifyRefreshToken, gstRegistration)
router.route('/updateGstDetails').put(verifyToken, verifyRefreshToken, updateGstDetails)

module.exports = router