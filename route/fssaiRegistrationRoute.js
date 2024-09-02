const { fssaiRegistration } = require('../controller/fssaiRegistrationController')
const router = require('express').Router()
const { verifyToken, verifyRefreshToken } = require('../utils/token')

router.route('/fssaiRegistration').post(verifyToken, verifyRefreshToken, fssaiRegistration)

module.exports = router